import {SupportRequestSubject} from './support-request-subject.enum';

export class SupportRequest {
  subject: SupportRequestSubject = SupportRequestSubject.OTHER;
  message = '';
}
