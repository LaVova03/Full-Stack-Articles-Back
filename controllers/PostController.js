import PostModel from "../models/Post.js"

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить статьи"
        })
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

        res.json(tags);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить теги"
        })
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        ).populate('user').exec();

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось найти статью"
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось создать статью"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndDelete({ _id: postId });

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        res.json({
            message: 'Статья успешно удалена'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось удалить статью"
        });
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const updateData = {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        };

        const result = await PostModel.updateOne({ _id: postId }, updateData);

        if (result.nModified === 0) {
            return res.status(404).json({
                message: 'Статья не найдена или данные не изменены'
            });
        }

        res.json({
            message: 'Статья успешно отредактирована'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось редактировать статью"
        });
    }
}