import req, { Options } from 'request';

interface IRequestResponse {
  res: req.Response | undefined;
  body: string | undefined;
}

export const request = (opts: Options): Promise<IRequestResponse> => {
  return new Promise((resolve) => {
    req(opts, (err, res, body) => {
      resolve({ res, body });
    });
  });
};
