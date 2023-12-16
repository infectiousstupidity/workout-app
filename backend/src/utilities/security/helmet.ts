import helmet from 'helmet';

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
    },
  },
  hidePoweredBy: true,
});

export default helmetConfig;
