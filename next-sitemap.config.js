const { siteConfig } = require('./app/metadata.config');

module.exports = {
  siteUrl: siteConfig.siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/shop'),
    await config.transform(config, '/about'),
    await config.transform(config, '/contact'),
    await config.transform(config, '/category?type=oversized-tees'),
    await config.transform(config, '/category?type=cropped-tees'),
    await config.transform(config, '/category?type=core-blanks'),
    await config.transform(config, '/category?type=foxy-fit-tees'),
    await config.transform(config, '/category?type=oversized-hoodies'),
    await config.transform(config, '/category?type=oversized-sweatshirts'),
  ],
};
