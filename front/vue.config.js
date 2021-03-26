// Configuration globale.
module.exports = {
    chainWebpack: config => {
        config
            .plugin("html")
            .tap(args => {
                args[0].title = "Groupomania";
                return args;
            })
    }
}