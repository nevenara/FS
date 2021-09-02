export const ApplicationType = Object.freeze({
    "WEB": 0, 
    "ADMIN_PANEL": 1, 
    "ORGANIZER": 2
})

export const RedirectionUrls = [
    {
        home: '/home',
        auth: '/auth'
    },
    {
        home: '/admin/dashboard',
        auth: '/admin/auth'
    },
    {
        home: '/organizer/dashboard',
        auth: '/organizer/auth'
    }
]