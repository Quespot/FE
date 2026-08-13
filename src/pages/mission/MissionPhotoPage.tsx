import { useNavigate } from "react-router-dom";
import { SubHeader } from "../../components/DeviceFrame";
import { Button, Panel } from "../../components/UI";
import { figmaAssets } from "../../data/quespot";
import {
  Camera,
  Check,
  ClipboardList,
  ImageUp,
  Lightbulb,
  X,
} from "lucide-react";

export default function MissionPhotoPage() {
  const navigate = useNavigate();

  return (
    <>
      <SubHeader
        title="사진 인증"
        onBack={() => navigate(-1)}
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
          <p>
            전통찻집 간판이 보이도록 외관을 촬영하거나, 내부에서 차를 즐기는
            사진을 찍어 제출하세요.
          </p>
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
            <Button icon={<Camera size={14} strokeWidth={2.4} />}>
              촬영하기
            </Button>
            <Button
              icon={<ImageUp size={14} strokeWidth={2.4} />}
              variant="secondary"
            >
              갤러리
            </Button>
          </div>
        </Panel>
        <Button variant="disabled" className="full-button">
          사진을 먼저 선택해주세요
        </Button>
      </section>
    </>
  );
}
