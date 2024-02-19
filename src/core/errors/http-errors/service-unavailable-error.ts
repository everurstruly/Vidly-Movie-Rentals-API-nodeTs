import * as httpStatus from 'src/common/plugins/http/http-status';
import { HttpError } from '.';
import { HttpErrorResponseFormatter } from 'src/common/plugins/http/http-error-formatter';

// 503 - Service Unavailable

const statusCode = 503;

class ServiceUnavailableError extends HttpError {
  constructor(
    message: HttpError['message'],
    issues: HttpError['issues'],
    cause: HttpError['cause']
  ) {
    super(message, 'ServiceUnavailableError', statusCode, issues, cause, {
      shouldExposeIssues: false,
    });
  }
}

export const ServiceUnavailableErrorBuilder = () =>
  new HttpErrorResponseFormatter({
    statusCode,
    issueCodeAliasToValueDict: {
      notReady: 'not-ready',
      backendNotConnected: 'backend-not-connected',
    } as const,
    buildMessage: (context) => {
      const { statusCode, resourceName, message } = context;
      const statusPhrase = httpStatus.getStatusCodePhrase(statusCode);
      if (message) return message;
      if (resourceName) return `${resourceName} ${statusPhrase}`;
      return httpStatus.getStatusCodeMessage(statusCode);
    },
    useFormatting: (formatting, cause) => {
      const { message = '', issues = null } = formatting;
      throw new ServiceUnavailableError(message, issues, cause);
    },
  });
