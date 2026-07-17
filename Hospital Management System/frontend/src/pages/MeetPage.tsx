// Video-call mockup. The "remote" side is a placeholder tile; the self-view
// shows YOUR real camera (local only — nothing is streamed or recorded). Mic and
// camera toggles + a call timer make it feel real.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';

export default function MeetPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as any) || {};
  const name: string = state.name || 'Patient';
  const sub: string = state.sub || 'Video consultation';

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [camError, setCamError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Call timer.
  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Start/stop the local camera preview when the camera is toggled.
  useEffect(() => {
    let cancelled = false;
    const stop = () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    if (camOn) {
      setCamError(false);
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (cancelled) return stream.getTracks().forEach((t) => t.stop());
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => setCamError(true));
    } else {
      stop();
    }
    return () => {
      cancelled = true;
      stop();
    };
  }, [camOn]);

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const endCall = () => navigate(-1);

  return (
    <div className="meet">
      <div className="meet__stage">
        <div className="meet__timer">● {mmss}</div>

        <div className="meet__remote">
          <Avatar name={name} size={120} />
          <div className="meet__remote-name">{name}</div>
          <div className="meet__remote-sub">{sub}</div>
        </div>

        <div className="meet__self">
          {camOn && !camError ? (
            <video ref={videoRef} autoPlay playsInline muted />
          ) : (
            <div className="meet__self-off">
              <IconCamOff />
              {camError ? 'Camera unavailable' : 'Camera off'}
            </div>
          )}
        </div>
      </div>

      <div className="meet__controls">
        <button className={`meet__btn${micOn ? '' : ' meet__btn--off'}`} onClick={() => setMicOn((m) => !m)} title={micOn ? 'Mute' : 'Unmute'}>
          {micOn ? <IconMic /> : <IconMicOff />}
        </button>
        <button className={`meet__btn${camOn ? '' : ' meet__btn--off'}`} onClick={() => setCamOn((c) => !c)} title={camOn ? 'Turn camera off' : 'Turn camera on'}>
          {camOn ? <IconCam /> : <IconCamOff />}
        </button>
        <button className="meet__btn meet__btn--end" onClick={endCall} title="End call">
          <IconEnd />
        </button>
      </div>

      <div style={{ textAlign: 'center', color: '#8a94a6', fontSize: 12 }}>
        Demo call — the preview uses your camera locally only. Nothing is streamed or recorded.
      </div>
    </div>
  );
}

function s(children: ReactNode) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
function IconMic() {
  return s(<>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" />
  </>);
}
function IconMicOff() {
  return s(<>
    <path d="M1 1l22 22M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4" />
  </>);
}
function IconCam() {
  return s(<>
    <path d="m23 7-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </>);
}
function IconCamOff() {
  return s(<>
    <path d="M1 1l22 22" />
    <path d="M16 16H3a2 2 0 0 1-2-2V7a2 2 0 0 1 .59-1.41M10 5h4a2 2 0 0 1 2 2v3l4-3v9" />
  </>);
}
function IconEnd() {
  return s(<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12 12 0 0 0 2.51.5A2 2 0 0 1 23 16.92v2A2 2 0 0 1 21 21 19 19 0 0 1 3 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 1.72c.13.9.3 1.71.5 2.51a2 2 0 0 1-.45 2.11L7.28 8.6" transform="rotate(135 12 12)" />);
}
