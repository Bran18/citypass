'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ScanLine } from 'lucide-react';
import { ActionForm } from './action-form';
import { Button } from './ui/button';
import { extractToken } from '@/lib/validation';
type Detector = { detect: (video: HTMLVideoElement) => Promise<{ rawValue: string }[]> };
export function ClaimForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (timer.current) clearTimeout(timer.current);
  };
  useEffect(() => {
    setToken(extractToken(location.href, location.origin));
    history.replaceState(null, '', location.pathname);
    return stop;
  }, []);
  async function scan() {
    stop();
    const DetectorClass = (
      window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => Detector }
    ).BarcodeDetector;
    if (!DetectorClass) {
      setMessage(t('cameraFallback'));
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      video.current!.srcObject = stream.current;
      await video.current!.play();
      const detector = new DetectorClass({ formats: ['qr_code'] });
      const tick = async () => {
        if (!stream.current) return;
        try {
          const results = await detector.detect(video.current!);
          const value = results[0]?.rawValue;
          if (value) {
            const found = extractToken(value, location.origin);
            if (found) {
              setToken(found);
              stop();
              return;
            }
          }
          timer.current = setTimeout(tick, 250);
        } catch {
          stop();
          setMessage(t('cameraFallback'));
        }
      };
      void tick();
    } catch {
      stop();
      setMessage(t('cameraFallback'));
    }
  }
  return (
    <div>
      <div className="scanner">
        <ScanLine size={64} />
        <video ref={video} muted playsInline aria-label={t('scan')} />
      </div>
      <div className="inline-actions">
        <Button type="button" variant="outline" onClick={scan}>
          {t('camera')}
        </Button>
        <Button type="button" variant="ghost" onClick={stop}>
          {t('stopCamera')}
        </Button>
      </div>
      {message && <p role="status">{message}</p>}
      <ActionForm locale={locale} command="claim_stamp" label={t('claim')}>
        <label>
          {t('qrCode')}
          <input
            name="token"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            pattern="[a-f0-9]{64}"
            autoComplete="off"
          />
        </label>
      </ActionForm>
      <p className="muted">{t('scanNote')}</p>
    </div>
  );
}
