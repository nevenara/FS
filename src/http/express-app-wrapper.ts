import * as express from 'express'

export class ExpressAppWrapper{
    public static urlPrefix: string = "/fansafe";

    constructor(private expressApp) {
    }

    public delete(route: string, asyncMiddleware: (req, res, next) => Promise<any>) {
        this.expressApp.delete(
            ExpressAppWrapper.urlPrefix + route,
            this.asyncHandler(asyncMiddleware),
        );
    }

    public get(route: string, asyncMiddleware: (req, res, next) => Promise<any>) {
        this.expressApp.get(
            ExpressAppWrapper.urlPrefix + route,
            this.asyncHandler(asyncMiddleware),
        );
    }

    public post(route: string, asyncMiddleware: (req, res, next) => Promise<any>) {
        this.expressApp.post(
            ExpressAppWrapper.urlPrefix + route,
            this.asyncHandler(asyncMiddleware),
        );
    }

    public put(route: string, asyncMiddleware: (req, res, next) => Promise<any>) {
        this.expressApp.put(
            ExpressAppWrapper.urlPrefix + route,
            this.asyncHandler(asyncMiddleware),
        );
    }

    // handles form data post requests that contain a file
    public postWithFile(route: string, upload, asyncMiddleware: (req, res, next) => Promise<any>) {
        this.expressApp.post(
            ExpressAppWrapper.urlPrefix + route,
            upload,
            this.asyncHandler(asyncMiddleware),
        );
    }

    public putWithFile(route: string, upload, asyncMiddleware: (req, res, next) => Promise<any>) {
        this.expressApp.put(
            ExpressAppWrapper.urlPrefix + route,
            upload,
            this.asyncHandler(asyncMiddleware),
        );
    }

    private asyncHandler(am) {
        return async (req, res, next) => {
            try {
                 await am(req, res, next);
            } catch (error) {
                next(error);
            }
        };
    }
}