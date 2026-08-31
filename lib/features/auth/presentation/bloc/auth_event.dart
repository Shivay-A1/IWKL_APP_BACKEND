abstract class AuthEvent {}

class LoginEvent extends AuthEvent {
  final String email;
  final String password;

  LoginEvent(this.email, this.password);
}

class RegisterEvent extends AuthEvent {
  final String email;
  final String password;
  final String name;
  final String? phone;

  RegisterEvent(this.email, this.password, this.name, this.phone);
}

class LogoutEvent extends AuthEvent {}

class CheckAuthEvent extends AuthEvent {}

class ForgotPasswordEvent extends AuthEvent {
  final String email;

  ForgotPasswordEvent(this.email);
}

class ResetPasswordEvent extends AuthEvent {
  final String email;
  final String password;
  final String otp;

  ResetPasswordEvent(this.email, this.password, this.otp);
}

class VerifyOtpEvent extends AuthEvent {
  final String email;
  final String otp;

  VerifyOtpEvent(this.email, this.otp);
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
