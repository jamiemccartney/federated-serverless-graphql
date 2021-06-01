export const sharedAuth = {
    authDirective: `
        directive @hasRoles(
           roles: [String],
        ) on FIELD_DEFINITION
    `,
    authResolver: async (next: () => any, _: any, args: { roles: any; }, context: { capabilities: any; }) => {
        const unauthorizedResult = () => {
            throw new Error("Not Authorized");
        };

        const requiredPermissions = args.roles;
        const userPermissions = context?.capabilities;

        if (!requiredPermissions || !userPermissions) {
            unauthorizedResult();
        }

        const hasRequiredPermissions = requiredPermissions.every((permission: any) => userPermissions.includes(permission));

        if (!hasRequiredPermissions) {
            unauthorizedResult();
        }

        return await next()
    }
};