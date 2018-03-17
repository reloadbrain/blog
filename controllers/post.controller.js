const Post = require('./../models/post.model');

const CategoryController = require('./../controllers/category.controller');

const FileHandler = require('./../handlers/file.handler');
const ValidationHandler = require('./../handlers/validation.handler');

class PostController {
    static getPosts() {
        return new Promise((resolve, reject) => {
            Post.find()
                .populate('category')
                .exec((err, posts) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(posts);
                    }
                });
        });
    }

    static savePost(post) {
        return new Promise((resolve, reject) => {
            Post.create({
                title: post.title,
                slug: post.slug,
                author: post.author,
                summary: post.summary,
                body: post.body,
                tags: post.tags,
                category: post.category,
                isPublished: post.isPublished,
                coverImage: post.coverImage,
                publishDate: post.publishDate
            }, (err, newPost) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newPost);
                }
            });
        });
    }

    static validatePost(post, files) {
        return new Promise((resolve, reject) => {
            let errors = [];

            if (files && files.coverImage) {
                post.coverImage = files.coverImage;
            } else {
                errors.push('You need to provide cover image');
            }
    
            if (ValidationHandler.regex(post.title, /^[A-Za-z0-9 ]{2,55}$/)) {
                post.title = ValidationHandler.testInput(post.title);
            } else {
                errors.push('Title is invalid');
            }
    
            if (ValidationHandler.regex(post.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
                post.slug = ValidationHandler.testInput(post.slug);
            } else {
                errors.push('Slug is invalid');
            }
    
            if (ValidationHandler.regex(post.author, /^[A-Za-z ]{3,20}$/)) {
                post.author = ValidationHandler.testInput(post.author);
            } else {
                errors.push('Author is invalid');
            }
    
            if (ValidationHandler.regex(post.publishDate, /^[0-9]*$/)) {
                post.publishDate = ValidationHandler.testInput(post.publishDate);
                post.publishDate = parseInt(post.publishDate);
            } else {
                errors.push('Publish date is invalid');
            }
    
            if (!ValidationHandler.checkScriptTag(post.summary)) {
                post.summary = ValidationHandler.testInput(post.summary);
            } else {
                errors.push('Summary is invalid');
            }
    
            if (!ValidationHandler.checkScriptTag(post.body)) {
                post.body = ValidationHandler.testInput(post.body);
            } else {
                errors.push('Body is invalid');
            }

            if (post.isPublished != 'false' && post.isPublished != 'true') {
                errors.push('Is published is invalid');
            }
    
            if (post.tags.constructor === Array) {
                let tags = post.tags;
                for (let tag of tags) {
                    if (tag.constructor !== String && ValidationHandler.checkScriptTag(tag)) {
                        errors.push('Tags is invalid');
                        break;
                    }
                }
            } else {
                errors.push('Tags is invalid');
            }
    
            if (errors.length) {
                reject(errors);
            } else {
                CategoryController.checkCategoryByIdFromPost(post)
                    .then(PostController.checkByTitleExist)
                    .then(PostController.checkBySlugExist)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }

    static checkByTitleExist(post) {
        return new Promise((resolve, reject) => {
            Post.findOne({
                title: post.title.toLowerCase()
            }).exec((err, postExist) => {
                if (err) {
                    reject(err);
                } else if (postExist) {
                    reject(['This title is already exist']);
                } else {
                    resolve(post);
                }
            })
        });
    }
    
    static checkBySlugExist(post) {
        return new Promise((resolve, reject) => {
            Post.findOne({
                slug: post.slug.toLowerCase()
            }).exec((err, postExist) => {
                if (err) {
                    reject(err);
                } else if (postExist) {
                    reject(['This slug is already exist']);
                } else {
                    resolve(post);
                }
            })
        });
    }

    static validateAndUploadPostImage(post) {
        return new Promise((resolve, reject) => {
            FileHandler.checkFilesErrors(post.coverImage, 'image', 2)
                .then(FileHandler.moveFiles)
                .then((newImageName) => {
                    post.coverImage = newImageName;
                    resolve(post);
                })
                .catch((err) => reject(err));
        });
    }
}

module.exports = PostController;