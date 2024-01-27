module.exports = {
    port: 4000,

    // Note: use dot env
    uri: 'mongodb://admin:admin123@host.docker.internal:27017/admin',
    DB_NAME: 'blog_db',
    
    // Enum of predefined categories and statues
    validCategories: ['Gaming', 'Art', 'Music', 'Movies', 'Anime', 'Work', 'Trending', 'Sports', 'Travel', 'Misc'],
    validStatus: [0, 1], // O=draft, 1=published

    SECRET_KEY: '<secretkey>'
}