export const Environment = {
  production: true,
  serviceUrl: 'http://fansafe-loadbalancer-1226084727.us-east-2.elb.amazonaws.com/fansafe',
  frontendHost: 'http://d26v62pj18pe42.cloudfront.net/',
  organizerUrl: 'http://fansafeorganizator.s3-website.eu-central-1.amazonaws.com/',
  adminUrl: 'http://fansafetestadminpanel.s3-website.eu-central-1.amazonaws.com/',
  applicationType: () => {
    return window['__env']['applicationType'];
  }
};