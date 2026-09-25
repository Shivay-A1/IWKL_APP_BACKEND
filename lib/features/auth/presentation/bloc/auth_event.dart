abstract class AuthEvent {}

class LoginEvent extends AuthEvent {
  final String phone;
  final String password;

  LoginEvent(this.phone, this.password);
}

class RegisterEvent extends AuthEvent {
  final String phone;
  final String password;
  final String firstName;
  final String? otp;

  RegisterEvent(this.phone, this.password, this.firstName, this.otp);
}

class LogoutEvent extends AuthEvent {}

class CheckAuthEvent extends AuthEvent {}

class ForgotPasswordEvent extends AuthEvent {
  final String phone;

  ForgotPasswordEvent(this.phone);
}

class ResetPasswordEvent extends AuthEvent {
  final String phone;
  final String newPassword;
  final String otp;

  ResetPasswordEvent(this.phone, this.newPassword, this.otp);
}

class VerifyOtpEvent extends AuthEvent {
  final String phone;
  final String otp;

  VerifyOtpEvent(this.phone, this.otp);
}

class PhoneLoginEvent extends AuthEvent {
  final String phone;
  final String password;

  PhoneLoginEvent(this.phone, this.password);
}

class SendOTPEvent extends AuthEvent {
  final String contact;
  final String type; // 'email' or 'phone'

  SendOTPEvent(this.contact, this.type);
}

class GoogleLoginEvent extends AuthEvent {}
