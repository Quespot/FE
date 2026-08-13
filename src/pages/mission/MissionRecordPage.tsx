import { useNavigate } from "react-router-dom";
import { SubHeader } from "../../components/DeviceFrame";
import { Button, Panel } from "../../components/UI";
import {
  Camera,
  Coffee,
  MessageCircle,
  PencilLine,
  Plus,
  X,
} from "lucide-react";

export default function MissionRecordPage() {
  const navigate = useNavigate();

  return (
    <>
      <SubHeader title="감상 기록" onBack={() => navigate(-1)} />
      <section className="mission-stack">
        <section className="visit-banner">
          <span>
            <PencilLine size={23} strokeWidth={2.4} />
          </span>
          <div>
            <strong>인사동 전통찻집</strong>
            <small>2026년 7월 8일 방문</small>
          </div>
        </section>

        <Panel className="record-panel">
          <header>
            <h2>
              <MessageCircle size={15} strokeWidth={2.5} />
              작성 프롬프트
            </h2>
            <button type="button">다른 질문 →</button>
          </header>
          <blockquote>"오늘 방문한 장소에서 가장 인상 깊었던 점은?"</blockquote>
          <textarea placeholder="여기에 자유롭게 적어보세요…" maxLength={300} />
          <small>0/300</small>
        </Panel>

        <Panel>
          <h2>
            <PencilLine size={15} strokeWidth={2.5} />이 장소를 한 단어로!
          </h2>
          <input
            className="soft-input"
            placeholder="예: 고요함, 따뜻함, 전통…"
          />
        </Panel>

        <Panel>
          <h2>
            <Camera size={15} strokeWidth={2.5} />
            사진 첨부
          </h2>
          <div className="attachment-row">
            <span className="photo-chip">
              <Coffee size={28} strokeWidth={2.3} />
            </span>
            <button type="button" aria-label="사진 추가">
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>
        </Panel>

        <Button className="full-button">감상 저장하기</Button>
      </section>
    </>
  );
}
