module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-max-line-length': [2, 'always', 200], // Extend line limit so semantic-release merge commit doesn't fail
    }
}
