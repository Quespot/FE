import { useNavigate } from "react-router-dom";
import { Button, TextField } from "../../components/UI";
import { Mail } from "lucide-react";
import { PATH } from "@/routes/paths";

export default function SignupPage() {
  const navigate = useNavigate();
  return (
    <>
      <section className="signup-screen">
        <h1>회원가입</h1>
        <TextField
          label="이메일"
          placeholder="example@email.com"
          type="email"
        />
        <TextField label="비밀번호" placeholder="••••••••" type="password" />
        <TextField
          label="비밀번호 확인"
          placeholder="••••••••"
          type="password"
        />
        <TextField label="닉네임" placeholder="닉네임을 입력하세요" />
        <Button
          icon={<Mail size={16} />}
          onClick={() => navigate(PATH.SIGNUP_CHECK)}
        >
          다음
        </Button>
        <small>
          이미 계정이 있으신가요? <b>로그인</b>
        </small>
      </section>
    </>
  );
}
