const asyncHandler = require("express-async-handler");
const Group = require("../models/Group");
const generateInviteToken = require("../utils/generateInviteToken");


// @desc    Create new group
// @route   POST /api/groups
// @access  Private
const createGroup = asyncHandler(async (req, res) => {
    const { name, description, contributionType, contributionAmount, frequency, startDate, privacy } = req.body;

    if (!name || !contributionType || !frequency || !startDate) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    if (contributionType === "fixed" && !contributionAmount) {
        res.status(400);
        throw new Error("Fixed contribution groups must have a contribution amount");
    }

    const group = new Group({
        name,
        description,
        contributionType,
        contributionAmount: contributionType === "fixed" ? contributionAmount : undefined,
        frequency,
        startDate,
        privacy: privacy || "public",
        createdBy: req.user._id,
        members: [{ user: req.user._id, role: "creator" }],
        rotationOrder: [req.user._id],
    });

    const createdGroup = await group.save();
    res.status(201).json(createdGroup);
});


// @desc    Get all groups user belongs to
// @route   GET /api/groups
// @access  Private
const getGroups = asyncHandler(async (req, res) => {
    const groups = await Group.find({ "members.user": req.user._id, isDeleted: false });
    res.json(groups);
});


// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private
const getGroupById = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id).populate("members.user", "name email");

    if (!group || group.isDeleted) {
        res.status(404);
        throw new Error("Group not found");
    }

    const isMember = group.members.some(m => m.user._id.toString() === req.user._id.toString());
    if (!isMember) {
        res.status(403);
        throw new Error("Not authorized to view this group");
    }

    res.json(group);
});


// @desc    Join a group
// @route   POST /api/groups/:id/join
// @access  Private
const joinGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group || group.isDeleted) {
        res.status(404);
        throw new Error("Group not found");
    }

    // ✅ Enforce privacy
    if (group.privacy === "private") {
        res.status(403);
        throw new Error("This group is private. You must be invited to join.");
    }

    // Check if already a member
    const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
    if (isMember) {
        res.status(400);
        throw new Error("User already a member of this group");
    }

    // Add user to members + rotation
    group.members.push({ user: req.user._id, role: "member" });
    group.rotationOrder.push(req.user._id);

    await group.save();
    res.status(201).json({ message: "Joined group successfully" });
});


// @desc    Update group (creator only)
// @route   PUT /api/groups/:id
// @access  Private
const updateGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group || group.isDeleted) {
        res.status(404);
        throw new Error("Group not found");
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Only the group creator can update the group");
    }

    // Restrict critical fields if members already joined
    if (group.members.length > 1) {
        if (
            req.body.contributionType ||
            req.body.contributionAmount ||
            req.body.frequency ||
            req.body.startDate
        ) {
            res.status(400);
            throw new Error("Cannot update contribution details once members have joined");
        }
    }

    // ✅ Whitelist allowed fields
    const allowedUpdates = ["name", "description", "privacy", "status"];
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            group[field] = req.body[field];
        }
    });

    const updatedGroup = await group.save();
    res.json(updatedGroup);
});


// @desc    Archive group (soft delete)
// @route   DELETE /api/groups/:id
// @access  Private
const deleteGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group || group.isDeleted) {
        res.status(404);
        throw new Error("Group not found");
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Only the group creator can delete the group");
    }

    group.isDeleted = true;
    group.status = "archived";

    await group.save();
    res.json({ message: "Group archived successfully" });
});


// @desc    Create invite token
// @route   POST /api/groups/:groupId/invite
// @access  Private
const createInvite = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.groupId);

    if (!group || group.isDeleted) {
        res.status(404);
        throw new Error("Group not found");
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Only the group creator can generate invites");
    }

    const token = generateInviteToken(group._id, req.user._id);

    res.json({ inviteLink: `${process.env.FRONTEND_URL}/join/${token}` });
});


module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    joinGroup,
    updateGroup,
    deleteGroup,
    createInvite,
};
