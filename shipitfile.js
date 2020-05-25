module.exports = (shipit) => {
    require('shipit-deploy')(shipit);

    shipit.initConfig({
        default: {
            deployTo: '/home/ba-project/api',
            repositoryUrl: 'git@gitlab.com:bachelor20191/api.git',
            ignores: ['.git', 'node_modules'],
            keepReleases: 3,
            keepWorkspace: false,
            deleteOnRollback: false,
            shallowClone: true,
        },
        production: {
            servers: 'ba-project@ssh.ls-rcr.com:2222',
            deployTo: '/home/ba-project/api/ba-api.cxdur.xyz',
            branch: 'master',
        },
    });

    shipit.blTask('install', () =>
       shipit.remote(`cd ${shipit.releasePath} && npm install`));

   shipit.blTask('restart', () =>
       shipit.remote('sudo /usr/sbin/service ba-api restart', {
           tty: true
       }));

   shipit.on('updated', () => shipit.start('install'));

   shipit.on("deployed", () => shipit.start('restart'));
};
