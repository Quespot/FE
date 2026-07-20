import { DeviceFrame, SubHeader } from "../components/DeviceFrame";
import { Button, Panel } from "../components/UI";
import { figmaAssets } from "../data/quespot";
import { Camera, Check, ClipboardList, Coffee, ImageUp, Lightbulb, MessageCircle, PencilLine, Plus, X } from "lucide-react";

type BackablePageProps = {
  onBack?: () => void;
};

export function PhotoCertificationPage({ onBack }: BackablePageProps) {
  return (
    <DeviceFrame className="app-device">
      <SubHeader
        title="사진 인증"
        onBack={onBack}
        action={
          <button className="hint-action" type="button">
            <Lightbulb size={13} strokeWidth={2.6} />
            힌트
          </button>
        }
      />
      <section className="mission-stack">
        <Panel>
          <h2>
            <ClipboardList size={15} strokeWidth={2.5} />
            인증 안내
          </h2>
          <strong>인사동 전통찻집 방문</strong>
          <p>전통찻집 간판이 보이도록 외관을 촬영하거나, 내부에서 차를 즐기는 사진을 찍어 제출하세요.</p>
        </Panel>

        <Panel className="example-panel">
          <h2>예시 사진</h2>
          <div className="example-grid">
            <figure>
              <div className="photo-example good">
                <img src={figmaAssets.goodPhoto} alt="좋은 인증 예시" />
                <span>
                  <Check size={10} strokeWidth={3} /> 좋은 예
                </span>
              </div>
              <figcaption>✅ 간판·내부 포함</figcaption>
            </figure>
            <figure>
              <div className="photo-example bad">
                <img src={figmaAssets.badPhoto} alt="나쁜 인증 예시" />
                <span>
                  <X size={10} strokeWidth={3} /> 나쁜 예
                </span>
              </div>
              <figcaption>❌ 장소 식별 불가</figcaption>
            </figure>
          </div>
        </Panel>

        <Panel className="upload-panel">
          <div className="camera-bubble">
            <Camera size={28} strokeWidth={2.4} />
          </div>
          <p>사진을 촬영하거나 업로드하세요</p>
          <div>
            <Button icon={<Camera size={14} strokeWidth={2.4} />}>촬영하기</Button>
            <Button icon={<ImageUp size={14} strokeWidth={2.4} />} variant="secondary">
              갤러리
            </Button>
          </div>
        </Panel>
        <Button variant="disabled" className="full-button">
          사진을 먼저 선택해주세요
        </Button>
      </section>
    </DeviceFrame>
  );
}

export function MissionRecordPage({ onBack }: BackablePageProps) {
  return (
    <DeviceFrame className="app-device">
      <SubHeader title="감상 기록" onBack={onBack} />
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
            <PencilLine size={15} strokeWidth={2.5} />
            이 장소를 한 단어로!
          </h2>
          <input className="soft-input" placeholder="예: 고요함, 따뜻함, 전통…" />
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
    </DeviceFrame>
  );
}
