const uploadCloudinary = async (req, res, next) => {
    if (!req.file) return next();

    const stream = cloudinary.uploader.upload_stream(
        {
            folder: 'thrift-app',
            public_id: `proof-${Date.now()}`,
            resource_type: 'auto',
        },
        (error, result) => {
            if (error) {
                console.error('Cloudinary Upload Error:', error);
                return next(error);
            }
            req.file.cloudinaryUrl = result.secure_url;
            next();
        },
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
};

module.exports = uploadCloudinary;
