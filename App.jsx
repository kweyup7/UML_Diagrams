import React, { useState, useEffect, useRef, useId } from 'react';
import {
  Users, ArrowRightLeft, Boxes, Network, Table2, ChevronLeft, ChevronRight, Shapes,
  ListOrdered, RotateCcw, Lightbulb, Menu, X, GraduationCap, CheckCircle2, Workflow, CircleDot, Layers,
} from 'lucide-react';

/* ------------------------------------------------------------------ *
 *  Diagram Workshop: an interactive tutorial for university computing
 *  students. Every symbol and diagram is inline SVG or HTML/CSS.
 *  Requires: React 18, Tailwind CSS, lucide-react.
 *  Case study throughout: "Student Consultation Booking System".
 * ------------------------------------------------------------------ */

const INK = '#1e293b';
const ACC = '#4f46e5';
const ACC_SOFT = '#eef2ff';
const MUTED = '#64748b';
const LINE = '#94a3b8';
const FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const HALO = { paintOrder: 'stroke', stroke: '#fff', strokeWidth: 4, strokeLinejoin: 'round' };

/* ========================= SVG PRIMITIVES ========================= */

function Markers({ p }) {
  return (
    <defs>
      {[['i', INK], ['a', ACC]].map(([k, c]) => (
        <React.Fragment key={k}>
          <marker id={`${p}-open-${k}`} viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M1 1.5 L11 6 L1 10.5" fill="none" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
          </marker>
          <marker id={`${p}-fill-${k}`} viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M1 1 L11 6 L1 11 Z" fill={c} stroke={c} strokeLinejoin="round" />
          </marker>
          <marker id={`${p}-tri-${k}`} viewBox="0 0 16 16" refX="15" refY="8" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M1 1.5 L15 8 L1 14.5 Z" fill="#fff" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
          </marker>
        </React.Fragment>
      ))}
    </defs>
  );
}

/** SVG wrapper. children is a function receiving m(type, colour) -> url(#marker). */
function Svg({ w, h, label, mini = false, children }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const m = (type, k = 'i') => `url(#${uid}-${type}-${k})`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={mini ? 'block h-24 w-auto max-w-full' : 'block h-auto w-full'}
      role="img"
      aria-label={label}
      style={{ fontFamily: FONT }}
    >
      <Markers p={uid} />
      {typeof children === 'function' ? children(m) : children}
    </svg>
  );
}

const T = ({ children, ...p }) => (
  <text fontSize="13" fill={INK} stroke="none" {...p}>{children}</text>
);

function Stickman({ x, y, scale = 1, label, color = INK, fill = '#fff', size = 13 }) {
  return (
    <g>
      <g transform={`translate(${x},${y}) scale(${scale})`} stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="0" cy="10" r="10" fill={fill} />
        <path d="M0 20 V46 M-16 29 H16 M0 46 L-13 68 M0 46 L13 68" />
      </g>
      {label && (
        <T x={x} y={y + 68 * scale + 18} textAnchor="middle" fontWeight="600" fill={color} fontSize={size}>{label}</T>
      )}
    </g>
  );
}

/* Responsive scaler for diagrams that mix HTML and SVG */
function ScaledCanvas({ w, h, children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setScale(Math.min(1, el.clientWidth / w));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className="w-full overflow-hidden" style={{ height: h * scale }}>
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

/* ========================= 1. USE CASE ========================= */

function UseCaseDiagram({ step }) {
  const c = (s) => (step === s ? ACC : INK);
  const f = (s) => (step === s ? ACC_SOFT : '#fff');
  const RX = 82, RY = 30;
  const ovals = [
    { label: 'Book Consultation', cx: 270, cy: 110 },
    { label: 'Check Availability', cx: 530, cy: 110 },
    { label: 'Reschedule Booking', cx: 270, cy: 235 },
    { label: 'Accept Booking', cx: 530, cy: 235 },
    { label: 'Cancel Booking', cx: 270, cy: 350 },
    { label: 'Manage Availability', cx: 530, cy: 350 },
  ];
  const assoc = [[81, 222, 188, 110], [81, 222, 188, 350], [719, 222, 612, 235], [719, 222, 612, 350]];
  return (
    <Svg w={800} h={430} label="Use case diagram of the Student Consultation Booking System">
      {(m) => (
        <>
          {step >= 2 && (
            <g>
              <rect x="150" y="20" width="500" height="390" rx="10" fill={step === 2 ? ACC_SOFT : '#f8fafc'} stroke={c(2)} strokeWidth="2" />
              <T x="400" y="46" textAnchor="middle" fontWeight="700" fill={c(2)} fontSize="15">Consultation Booking System</T>
            </g>
          )}
          {step >= 4 && assoc.map((a, i) => (
            <line key={i} x1={a[0]} y1={a[1]} x2={a[2]} y2={a[3]} stroke={c(4)} strokeWidth="1.8" />
          ))}
          {step >= 5 && (
            <g stroke={c(5)} strokeWidth="1.8" strokeDasharray="7 5" fill="none">
              <line x1="352" y1="110" x2="448" y2="110" markerEnd={m('open', step === 5 ? 'a' : 'i')} />
              <line x1="270" y1="205" x2="270" y2="141" markerEnd={m('open', step === 5 ? 'a' : 'i')} />
            </g>
          )}
          {step >= 5 && (
            <>
              <T x="400" y="100" textAnchor="middle" fontStyle="italic" fill={c(5)} fontSize="12.5" style={HALO}>«include»</T>
              <T x="280" y="176" fontStyle="italic" fill={c(5)} fontSize="12.5" style={HALO}>«extend»</T>
            </>
          )}
          {step >= 3 && ovals.map((o) => (
            <g key={o.label}>
              <ellipse cx={o.cx} cy={o.cy} rx={RX} ry={RY} fill={f(3)} stroke={c(3)} strokeWidth="2" />
              <T x={o.cx} y={o.cy + 4.5} textAnchor="middle" fill={c(3)}>{o.label}</T>
            </g>
          ))}
          <Stickman x={65} y={190} label="Student" color={c(1)} fill={f(1)} />
          <Stickman x={735} y={190} label="Lecturer" color={c(1)} fill={f(1)} />
        </>
      )}
    </Svg>
  );
}

/* ========================= 2. SEQUENCE ========================= */

function SequenceDiagram({ step }) {
  const X = { s: 110, sys: 320, db: 530, lec: 730 };
  const c = (s) => (step === s ? ACC : INK);
  const f = (s) => (step === s ? ACC_SOFT : '#fff');
  const bar = step >= 5 ? 6 : 0;
  const msgs = [
    { n: 1, f: 's', t: 'sys', y: 128, l: 'requestConsultation(slot)', k: 'sync', s: 3 },
    { n: 2, f: 'sys', t: 'db', y: 168, l: 'checkAvailability(slot)', k: 'sync', s: 3 },
    { n: 3, f: 'db', t: 'sys', y: 206, l: 'slotStatus', k: 'ret', s: 4 },
    { n: 4, f: 'sys', t: 'lec', y: 268, l: 'notifyRequest(booking)', k: 'sync', s: 3 },
    { n: 5, f: 'lec', t: 'sys', y: 306, l: 'acceptBooking(id)', k: 'sync', s: 3 },
    { n: 6, f: 'sys', t: 'db', y: 344, l: 'saveBooking(booking)', k: 'sync', s: 3 },
    { n: 7, f: 'sys', t: 's', y: 382, l: 'bookingConfirmed', k: 'ret', s: 4 },
    { n: 8, f: 'sys', t: 's', y: 448, l: 'slotUnavailable', k: 'ret', s: 6 },
  ];
  const boxes = [
    { k: 'sys', l: ':BookingSystem' },
    { k: 'db', l: ':Database' },
    { k: 'lec', l: ':Lecturer' },
  ];
  const bars = [
    { k: 'sys', y1: 122, y2: 458 }, { k: 's', y1: 122, y2: 458 },
    { k: 'db', y1: 162, y2: 212 }, { k: 'db', y1: 338, y2: 350 },
    { k: 'lec', y1: 262, y2: 312 },
  ];
  return (
    <Svg w={820} h={545} label="Sequence diagram of booking a consultation">
      {(m) => (
        <>
          {step >= 2 && Object.values(X).map((x) => (
            <line key={x} x1={x} y1="92" x2={x} y2="520" stroke={step === 2 ? ACC : LINE} strokeWidth="1.8" strokeDasharray="7 6" />
          ))}
          {step >= 6 && (
            <g>
              <rect x="40" y="226" width="760" height="254" fill="none" stroke={c(6)} strokeWidth="1.8" />
              <path d="M40 226 H88 V240 L80 248 H40 Z" fill={f(6)} stroke={c(6)} strokeWidth="1.8" />
              <T x="48" y="242" fontWeight="700" fill={c(6)} fontSize="12">alt</T>
              <T x="132" y="242" fill={c(6)} fontSize="12" fontWeight="600">[slot available]</T>
              <line x1="40" y1="406" x2="800" y2="406" stroke={c(6)} strokeWidth="1.5" strokeDasharray="8 5" />
              <T x="48" y="424" fill={c(6)} fontSize="12" fontWeight="600">[else]</T>
            </g>
          )}
          {step >= 5 && bars.map((b, i) => (
            <rect key={i} x={X[b.k] - 6} y={b.y1} width="12" height={b.y2 - b.y1} fill={f(5)} stroke={c(5)} strokeWidth="1.8" />
          ))}
          {msgs.filter((q) => step >= q.s).map((q) => {
            const dir = X[q.t] > X[q.f] ? 1 : -1;
            const x1 = X[q.f] + dir * bar;
            const x2 = X[q.t] - dir * bar;
            const col = c(q.s);
            const k = step === q.s ? 'a' : 'i';
            return (
              <g key={q.n}>
                <line
                  x1={x1} y1={q.y} x2={x2} y2={q.y} stroke={col} strokeWidth="1.8"
                  strokeDasharray={q.k === 'ret' ? '7 5' : undefined}
                  markerEnd={m(q.k === 'ret' ? 'open' : 'fill', k)}
                />
                <T x={(x1 + x2) / 2} y={q.y - 8} textAnchor="middle" fontSize="12.5" fill={col} style={HALO}>
                  {q.n}: {q.l}
                </T>
              </g>
            );
          })}
          <Stickman x={X.s} y={20} scale={0.8} label="Student" color={c(1)} fill={f(1)} size={13} />
          {boxes.map((b) => (
            <g key={b.k}>
              <rect x={X[b.k] - 70} y="52" width="140" height="38" rx="3" fill={f(1)} stroke={c(1)} strokeWidth="2" />
              <T x={X[b.k]} y="76" textAnchor="middle" fontWeight="600" fill={c(1)}>{b.l}</T>
            </g>
          ))}
        </>
      )}
    </Svg>
  );
}

/* ========================= 3. CLASS ========================= */

const CLASSES = [
  { id: 'user', name: 'User', stereo: '«abstract»', x: 290, y: 10, w: 220, abstract: true,
    attrs: ['- userId: int', '- fullName: String', '- email: String'],
    methods: ['+ login(): boolean', '+ logout(): void'] },
  { id: 'student', name: 'Student', x: 30, y: 250, w: 250,
    attrs: ['- studentNo: String', '- course: String'],
    methods: ['+ requestBooking(slot): Booking', '+ cancelBooking(id): void'] },
  { id: 'lecturer', name: 'Lecturer', x: 540, y: 250, w: 250,
    attrs: ['- staffNo: String', '- department: String'],
    methods: ['+ acceptBooking(id): void', '+ setAvailability(): void'] },
  { id: 'booking', name: 'Booking', x: 290, y: 440, w: 220,
    attrs: ['- bookingId: int', '- status: Status', '# createdAt: Date'],
    methods: ['+ confirm(): void', '+ cancel(): void'] },
  { id: 'slot', name: 'TimeSlot', x: 590, y: 470, w: 220,
    attrs: ['- slotId: int', '- startTime: DateTime', '- endTime: DateTime', '- isFree: boolean'],
    methods: ['+ reserve(): void', '+ release(): void'] },
];

function ClassBox({ cls, step }) {
  const hdr = cls.stereo ? 50 : 34;
  return (
    <div
      className="absolute box-border border-2 border-slate-700 bg-white text-slate-800"
      style={{ left: cls.x, top: cls.y, width: cls.w }}
    >
      <div
        className={`flex flex-col items-center justify-center font-bold ${step === 1 ? 'bg-indigo-50 text-indigo-700' : ''}`}
        style={{ height: hdr }}
      >
        {cls.stereo && <span className="text-[11px] font-normal italic leading-none mb-0.5">{cls.stereo}</span>}
        <span className={`text-[15px] leading-tight ${cls.abstract ? 'italic' : ''}`}>{cls.name}</span>
      </div>
      {step >= 2 && (
        <div
          className={`box-border border-t-2 border-slate-700 px-2 py-1.5 font-mono text-[12.5px] ${step === 2 ? 'bg-indigo-50 text-indigo-800' : ''}`}
          style={{ height: cls.attrs.length * 20 + 14 }}
        >
          {cls.attrs.map((a) => <div key={a} className="h-5 leading-5 whitespace-nowrap">{a}</div>)}
        </div>
      )}
      {step >= 3 && (
        <div
          className={`box-border border-t-2 border-slate-700 px-2 py-1.5 font-mono text-[12.5px] ${step === 3 ? 'bg-indigo-50 text-indigo-800' : ''}`}
          style={{ height: cls.methods.length * 20 + 14 }}
        >
          {cls.methods.map((a) => <div key={a} className="h-5 leading-5 whitespace-nowrap">{a}</div>)}
        </div>
      )}
    </div>
  );
}

function ClassDiagram({ step }) {
  const c = (s) => (step === s ? ACC : INK);
  const k = (s) => (step === s ? 'a' : 'i');
  const m = (t, kk = 'i') => `url(#cd-${t}-${kk})`;
  const tx = { fontSize: 12.5, fontWeight: 600 };
  return (
    <ScaledCanvas w={830} h={670}>
      <svg className="absolute inset-0" width="830" height="670" style={{ fontFamily: FONT }} aria-hidden="true">
        <Markers p="cd" />
        {step >= 4 && (
          <g fill="none" stroke={c(4)} strokeWidth="1.8">
            <path d="M155 250 V214 H665 V250" />
            <path d="M400 214 V184" markerEnd={m('tri', k(4))} />
          </g>
        )}
        {step >= 5 && (
          <g fill="none" stroke={c(5)} strokeWidth="1.8">
            <path d="M155 388 V517 H290" />
            <path d="M570 388 V517 H510" />
            <g fill={c(5)} stroke="none">
              <T x="163" y="408" {...tx} fill={c(5)}>1</T>
              <T x="262" y="511" {...tx} fill={c(5)} textAnchor="end">0..*</T>
              <T x="222" y="536" fontStyle="italic" fontSize="12.5" fill={c(5)} textAnchor="middle">makes</T>
              <T x="578" y="408" {...tx} fill={c(5)}>1</T>
              <T x="516" y="511" {...tx} fill={c(5)}>0..*</T>
              <T x="540" y="536" fontStyle="italic" fontSize="12.5" fill={c(5)} textAnchor="middle">receives</T>
            </g>
          </g>
        )}
        {step >= 6 && (
          <g fill="none" stroke={c(6)} strokeWidth="1.8">
            <polygon points="690,388 680,402 690,416 700,402" fill={c(6)} />
            <path d="M690 416 V470" />
            <path d="M510 570 H590" markerEnd={m('open', k(6))} />
            <g stroke="none">
              <T x="700" y="432" {...tx} fill={c(6)}>1</T>
              <T x="700" y="450" fontStyle="italic" fontSize="12.5" fill={c(6)}>offers</T>
              <T x="700" y="466" {...tx} fill={c(6)}>0..*</T>
              <T x="516" y="563" {...tx} fill={c(6)}>0..*</T>
              <T x="582" y="563" {...tx} fill={c(6)} textAnchor="end">1</T>
              <T x="550" y="590" fontStyle="italic" fontSize="12.5" fill={c(6)} textAnchor="middle">reserves</T>
            </g>
          </g>
        )}
      </svg>
      {CLASSES.map((cl) => <ClassBox key={cl.id} cls={cl} step={step} />)}
    </ScaledCanvas>
  );
}

/* ========================= 4. CHEN ER ========================= */

function ChenDiagram({ step }) {
  const c = (s) => (step === s ? ACC : INK);
  const f = (s) => (step === s ? ACC_SOFT : '#fff');
  const owner = {
    stu: [120, 330], lec: [560, 330], slot: [560, 580], books: [340, 330],
  };
  const attrs = [
    { o: 'stu', x: 60, y: 225, l: 'studentNo', key: 1, s: 2 },
    { o: 'stu', x: 180, y: 205, l: 'fullName', s: 2 },
    { o: 'stu', x: 60, y: 440, l: 'email', s: 2 },
    { o: 'stu', x: 180, y: 450, l: 'course', s: 2 },
    { o: 'stu', x: 110, y: 525, l: 'phoneNo', multi: 1, s: 3 },
    { o: 'lec', x: 505, y: 225, l: 'staffNo', key: 1, s: 2 },
    { o: 'lec', x: 625, y: 200, l: 'fullName', s: 2 },
    { o: 'lec', x: 725, y: 295, l: 'department', s: 2 },
    { o: 'lec', x: 725, y: 370, l: 'email', s: 2 },
    { o: 'slot', x: 400, y: 555, l: 'slotId', key: 1, s: 2 },
    { o: 'slot', x: 730, y: 555, l: 'startTime', s: 2 },
    { o: 'slot', x: 730, y: 620, l: 'endTime', s: 2 },
    { o: 'slot', x: 400, y: 620, l: 'duration', derived: 1, s: 3 },
    { o: 'books', x: 290, y: 200, l: 'bookingDate', s: 5 },
    { o: 'books', x: 400, y: 180, l: 'status', s: 5 },
    { o: 'books', x: 340, y: 445, l: 'topic', s: 5 },
  ].filter((a) => step >= a.s);
  const ents = [
    { x: 120, y: 330, l: 'STUDENT' },
    { x: 560, y: 330, l: 'LECTURER' },
    { x: 560, y: 580, l: 'TIME_SLOT' },
  ];
  const rels = [{ x: 340, y: 330, l: 'BOOKS' }, { x: 560, y: 470, l: 'OFFERS' }];
  const RX = 48, RY = 19;
  const cardStyle = { fontWeight: 700, fontSize: 15, fill: ACC };
  return (
    <Svg w={880} h={520} label="Chen notation ER diagram of the Student Consultation Booking System">
      {() => (
        <g transform="translate(0,-130)">
          {attrs.map((a) => (
            <line key={a.o + a.l} x1={a.x} y1={a.y} x2={owner[a.o][0]} y2={owner[a.o][1]} stroke={c(a.s)} strokeWidth="1.6" />
          ))}
          {step >= 4 && (
            <g stroke={c(4)} strokeWidth="1.8" fill="none">
              <path d="M185 330 H275" />
              <path d="M405 330 H495" />
              <path d="M560 355 V435" />
              {step < 6 && <path d="M560 505 V555" />}
              {step >= 6 && (
                <g stroke={c(6)}>
                  <path d="M555 505 V555" />
                  <path d="M565 505 V555" />
                </g>
              )}
            </g>
          )}
          {step >= 4 && rels.map((r) => (
            <g key={r.l}>
              <polygon
                points={`${r.x - 65},${r.y} ${r.x},${r.y - 35} ${r.x + 65},${r.y} ${r.x},${r.y + 35}`}
                fill={f(4)} stroke={c(4)} strokeWidth="2"
              />
              <T x={r.x} y={r.y + 4.5} textAnchor="middle" fontWeight="700" fill={c(4)}>{r.l}</T>
            </g>
          ))}
          {attrs.map((a) => (
            <g key={a.o + a.l + 'n'}>
              {a.multi && <ellipse cx={a.x} cy={a.y} rx={RX + 5} ry={RY + 5} fill="#fff" stroke={c(a.s)} strokeWidth="1.8" />}
              <ellipse
                cx={a.x} cy={a.y} rx={RX} ry={RY} fill={f(a.s)} stroke={c(a.s)} strokeWidth="1.8"
                strokeDasharray={a.derived ? '6 4' : undefined}
              />
              <T x={a.x} y={a.y + 4.5} textAnchor="middle" fontSize="12.5" fill={c(a.s)} textDecoration={a.key ? 'underline' : undefined}>
                {a.l}
              </T>
            </g>
          ))}
          {ents.map((e) => (
            <g key={e.l}>
              <rect x={e.x - 65} y={e.y - 25} width="130" height="50" fill={f(1)} stroke={c(1)} strokeWidth="2.2" />
              <T x={e.x} y={e.y + 4.5} textAnchor="middle" fontWeight="700" fill={c(1)}>{e.l}</T>
            </g>
          ))}
          {step >= 5 && (
            <g>
              <text x="200" y="320" {...cardStyle}>N</text>
              <text x="470" y="320" {...cardStyle}>M</text>
              <text x="570" y="392" {...cardStyle}>1</text>
              <text x="570" y="540" {...cardStyle}>N</text>
            </g>
          )}
        </g>
      )}
    </Svg>
  );
}

/* ========================= 5. SCHEMA ========================= */

const TABLES = [
  { id: 'student', name: 'STUDENT', x: 44, y: 20, s: 1, cols: [
    { n: 'student_no', t: 'VARCHAR(10)', pk: 1 }, { n: 'full_name', t: 'VARCHAR(100)' },
    { n: 'email', t: 'VARCHAR(120)' }, { n: 'course', t: 'VARCHAR(60)' }] },
  { id: 'lecturer', name: 'LECTURER', x: 676, y: 20, s: 1, cols: [
    { n: 'staff_no', t: 'VARCHAR(10)', pk: 1 }, { n: 'full_name', t: 'VARCHAR(100)' },
    { n: 'email', t: 'VARCHAR(120)' }, { n: 'department', t: 'VARCHAR(60)' }] },
  { id: 'phone', name: 'STUDENT_PHONE', x: 44, y: 250, s: 2, cols: [
    { n: 'student_no', t: 'VARCHAR(10)', pk: 1, fk: 1 }, { n: 'phone_no', t: 'VARCHAR(15)', pk: 1 }] },
  { id: 'slot', name: 'TIME_SLOT', x: 676, y: 250, s: 3, cols: [
    { n: 'slot_id', t: 'INT', pk: 1 }, { n: 'staff_no', t: 'VARCHAR(10)', fk: 1 },
    { n: 'start_time', t: 'DATETIME' }, { n: 'end_time', t: 'DATETIME' }] },
  { id: 'booking', name: 'BOOKING', x: 360, y: 40, s: 4, cols: [
    { n: 'booking_id', t: 'INT', pk: 1 }, { n: 'student_no', t: 'VARCHAR(10)', fk: 1 },
    { n: 'staff_no', t: 'VARCHAR(10)', fk: 1 }, { n: 'booking_date', t: 'DATE' },
    { n: 'status', t: 'VARCHAR(15)' }, { n: 'topic', t: 'VARCHAR(120)' }] },
];

function Badge({ k }) {
  const style = k === 'PK'
    ? 'bg-amber-100 text-amber-800 ring-amber-300'
    : 'bg-sky-100 text-sky-800 ring-sky-300';
  return <span className={`inline-block w-7 rounded px-1 py-px text-center text-[10px] font-bold ring-1 ${style}`}>{k}</span>;
}

function SchemaTable({ t, isNew, width = 280 }) {
  return (
    <div
      className={`absolute box-border overflow-hidden rounded-md border bg-white shadow-sm ${isNew ? 'border-indigo-500 ring-2 ring-indigo-400' : 'border-slate-300'}`}
      style={{ left: t.x, top: t.y, width }}
    >
      <div className={`flex items-center px-3 text-[13px] font-bold tracking-wide ${isNew ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'}`} style={{ height: 36 }}>
        {t.name}
      </div>
      {t.cols.map((col) => (
        <div key={col.n} className="box-border flex items-center gap-2 border-t border-slate-200 px-3 text-[13px]" style={{ height: 28 }}>
          <span className="flex w-[62px] shrink-0 gap-0.5">
            {col.pk && <Badge k="PK" />}
            {col.fk && <Badge k="FK" />}
          </span>
          <span className={`font-mono ${col.pk ? 'font-bold' : ''} ${col.fk ? 'italic' : ''}`}>{col.n}</span>
          <span className="ml-auto font-mono text-[11px] text-slate-500">{col.t}</span>
        </div>
      ))}
    </div>
  );
}

function SchemaDiagram({ step }) {
  const m = (t, k = 'i') => `url(#sd-${t}-${k})`;
  const col = step === 5 ? ACC : INK;
  const kk = step === 5 ? 'a' : 'i';
  const lab = { fontWeight: 700, fontSize: 12, fill: col };
  return (
    <ScaledCanvas w={990} h={420}>
      <svg className="absolute inset-0" width="990" height="420" style={{ fontFamily: FONT }} aria-hidden="true">
        <Markers p="sd" />
        {step >= 5 && (
          <g fill="none" stroke={col} strokeWidth="1.8">
            <path d="M44 300 H18 V70 H44" markerEnd={m('open', kk)} />
            <path d="M360 118 H342 V70 H324" markerEnd={m('open', kk)} />
            <path d="M640 146 H658 V70 H676" markerEnd={m('open', kk)} />
            <path d="M956 328 H974 V70 H956" markerEnd={m('open', kk)} />
            <g stroke="none">
              <text x="22" y="294" {...lab}>N</text><text x="24" y="86" {...lab}>1</text>
              <text x="346" y="134" {...lab}>N</text><text x="326" y="62" {...lab}>1</text>
              <text x="645" y="162" {...lab}>N</text><text x="660" y="62" {...lab}>1</text>
              <text x="960" y="322" {...lab}>N</text><text x="960" y="62" {...lab}>1</text>
            </g>
          </g>
        )}
      </svg>
      {TABLES.filter((t) => step >= t.s).map((t) => <SchemaTable key={t.id} t={t} isNew={step === t.s && step < 5} />)}
      <div className="absolute rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-[12px] leading-relaxed text-slate-600" style={{ left: 360, top: 270, width: 280 }}>
        <div className="mb-1.5 font-semibold text-slate-800">Reading the arrows</div>
        <div className="flex items-center gap-2"><Badge k="PK" /> uniquely identifies a row</div>
        <div className="mt-1 flex items-center gap-2"><Badge k="FK" /> points to a PK in another table</div>
        <div className="mt-1.5"><b className="text-indigo-700">N → 1</b>: many rows here reference one row there.</div>
      </div>
    </ScaledCanvas>
  );
}

/* ========================= SYMBOL REFERENCE ========================= */

function SymbolCard({ name, def, note, children }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 px-2">{children}</div>
      <div>
        <h4 className="font-semibold text-slate-900">{name}</h4>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{def}</p>
        {note && <p className="mt-2 rounded bg-indigo-50 px-2 py-1 text-xs text-indigo-800">{note}</p>}
      </div>
    </div>
  );
}

const Mini = ({ w = 200, h = 100, label, children }) => <Svg mini w={w} h={h} label={label}>{children}</Svg>;

const useCaseSymbols = [
  { name: 'Actor', def: 'A role played by a person or external system that interacts with the system. Always drawn outside the boundary and named with a noun.', note: 'Example: Student, Lecturer.',
    v: <Mini label="Actor stickman"><Stickman x={100} y={6} scale={0.9} label="Student" /></Mini> },
  { name: 'Use case', def: 'One goal the actor achieves with the system, drawn as an oval and named verb + noun.', note: 'Example: Book Consultation.',
    v: <Mini label="Use case oval">{() => <><ellipse cx="100" cy="50" rx="78" ry="28" fill="#fff" stroke={INK} strokeWidth="2" /><T x="100" y="54.5" textAnchor="middle">Book Consultation</T></>}</Mini> },
  { name: 'System boundary', def: 'A rectangle that separates what the system does (inside) from the actors that use it (outside). The system name sits at the top.',
    v: <Mini label="System boundary">{() => <><rect x="25" y="8" width="150" height="84" rx="6" fill="#f8fafc" stroke={INK} strokeWidth="2" /><T x="100" y="26" textAnchor="middle" fontWeight="700" fontSize="12">System name</T><ellipse cx="100" cy="62" rx="48" ry="18" fill="#fff" stroke={INK} strokeWidth="1.8" /></>}</Mini> },
  { name: 'Association', def: 'A solid line showing that an actor takes part in a use case. No arrowhead is needed.',
    v: <Mini label="Association line">{() => <><Stickman x={30} y={12} scale={0.75} /><line x1="46" y1="36" x2="86" y2="46" stroke={INK} strokeWidth="1.8" /><ellipse cx="138" cy="48" rx="52" ry="24" fill="#fff" stroke={INK} strokeWidth="2" /></>}</Mini> },
  { name: '«include»', def: 'A dashed arrow from a base use case to a use case it always runs as part of itself. Use it to share mandatory steps.', note: 'Book Consultation «include» Check Availability.',
    v: <Mini label="Include relationship">{(m) => <><ellipse cx="34" cy="52" rx="30" ry="20" fill="#fff" stroke={INK} strokeWidth="1.8" /><ellipse cx="166" cy="52" rx="30" ry="20" fill="#fff" stroke={INK} strokeWidth="1.8" /><line x1="64" y1="52" x2="136" y2="52" stroke={INK} strokeWidth="1.8" strokeDasharray="6 4" markerEnd={m('open')} /><T x="100" y="44" textAnchor="middle" fontSize="11" fontStyle="italic">«include»</T></>}</Mini> },
  { name: '«extend»', def: 'A dashed arrow from an optional extension to the base use case it adds to. It runs only when a condition is met.', note: 'Reschedule Booking «extend» Book Consultation.',
    v: <Mini label="Extend relationship">{(m) => <><ellipse cx="34" cy="52" rx="30" ry="20" fill="#fff" stroke={INK} strokeWidth="1.8" /><ellipse cx="166" cy="52" rx="30" ry="20" fill="#fff" stroke={INK} strokeWidth="1.8" /><line x1="136" y1="52" x2="64" y2="52" stroke={INK} strokeWidth="1.8" strokeDasharray="6 4" markerEnd={m('open')} /><T x="100" y="44" textAnchor="middle" fontSize="11" fontStyle="italic">«extend»</T></>}</Mini> },
  { name: 'Generalization', def: 'A solid line with a hollow triangle pointing at the more general actor or use case. The child inherits its parent’s behaviour.',
    v: <Mini label="Generalization between actors">{(m) => <><Stickman x={40} y={10} scale={0.7} label="Postgrad" size={11} /><Stickman x={160} y={10} scale={0.7} label="Student" size={11} /><line x1="58" y1="36" x2="140" y2="36" stroke={INK} strokeWidth="1.8" markerEnd={m('tri')} /></>}</Mini> },
];

const sequenceSymbols = [
  { name: 'Actor / participant', def: 'Each column starts with the thing taking part: a stickman for a person, a rectangle for a system or object (:ClassName).',
    v: <Mini label="Participants">{() => <><Stickman x={45} y={8} scale={0.8} label="Student" size={11} /><rect x="95" y="28" width="95" height="36" rx="3" fill="#fff" stroke={INK} strokeWidth="2" /><T x="142" y="51" textAnchor="middle" fontSize="12" fontWeight="600">:BookingSystem</T></>}</Mini> },
  { name: 'Lifeline', def: 'A dashed vertical line under a participant. Time flows downward, so a lower message happens later.',
    v: <Mini label="Lifeline">{() => <><rect x="55" y="8" width="90" height="30" rx="3" fill="#fff" stroke={INK} strokeWidth="2" /><T x="100" y="28" textAnchor="middle" fontSize="12" fontWeight="600">:Database</T><line x1="100" y1="38" x2="100" y2="96" stroke={LINE} strokeWidth="1.8" strokeDasharray="6 5" /></>}</Mini> },
  { name: 'Activation bar', def: 'A thin rectangle on a lifeline showing the period in which that participant is busy executing a call.',
    v: <Mini label="Activation bar">{() => <><line x1="100" y1="6" x2="100" y2="96" stroke={LINE} strokeWidth="1.8" strokeDasharray="6 5" /><rect x="94" y="26" width="12" height="46" fill="#fff" stroke={INK} strokeWidth="1.8" /></>}</Mini> },
  { name: 'Synchronous message', def: 'A solid line with a filled arrowhead. The sender waits for the receiver to finish before continuing.', note: 'Label: operationName(arguments).',
    v: <Mini label="Synchronous message">{(m) => <><line x1="40" y1="6" x2="40" y2="96" stroke={LINE} strokeDasharray="6 5" strokeWidth="1.8" /><line x1="160" y1="6" x2="160" y2="96" stroke={LINE} strokeDasharray="6 5" strokeWidth="1.8" /><line x1="40" y1="52" x2="158" y2="52" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /><T x="100" y="44" textAnchor="middle" fontSize="12">request()</T></>}</Mini> },
  { name: 'Asynchronous message', def: 'A solid line with an open arrowhead. The sender carries on without waiting, for example sending a notification.',
    v: <Mini label="Asynchronous message">{(m) => <><line x1="40" y1="6" x2="40" y2="96" stroke={LINE} strokeDasharray="6 5" strokeWidth="1.8" /><line x1="160" y1="6" x2="160" y2="96" stroke={LINE} strokeDasharray="6 5" strokeWidth="1.8" /><line x1="40" y1="52" x2="158" y2="52" stroke={INK} strokeWidth="1.8" markerEnd={m('open')} /><T x="100" y="44" textAnchor="middle" fontSize="12">notify()</T></>}</Mini> },
  { name: 'Return message', def: 'A dashed line with an open arrowhead carrying a result back to the caller.',
    v: <Mini label="Return message">{(m) => <><line x1="40" y1="6" x2="40" y2="96" stroke={LINE} strokeDasharray="6 5" strokeWidth="1.8" /><line x1="160" y1="6" x2="160" y2="96" stroke={LINE} strokeDasharray="6 5" strokeWidth="1.8" /><line x1="158" y1="52" x2="42" y2="52" stroke={INK} strokeWidth="1.8" strokeDasharray="7 5" markerEnd={m('open')} /><T x="100" y="44" textAnchor="middle" fontSize="12">result</T></>}</Mini> },
  { name: 'Self-message', def: 'An arrow that loops back to the same lifeline, used when an object calls its own operation.',
    v: <Mini label="Self message">{(m) => <><line x1="70" y1="6" x2="70" y2="96" stroke={LINE} strokeDasharray="6 5" strokeWidth="1.8" /><path d="M70 30 H130 V62 H72" fill="none" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /><T x="136" y="50" fontSize="12">validate()</T></>}</Mini> },
  { name: 'Combined fragment (alt)', def: 'A labelled frame around messages that happen only under a condition. alt shows alternatives separated by a dashed line.',
    v: <Mini label="Alt fragment">{() => <><rect x="20" y="8" width="160" height="84" fill="none" stroke={INK} strokeWidth="1.8" /><path d="M20 8 H52 V20 L46 26 H20 Z" fill="#fff" stroke={INK} strokeWidth="1.6" /><T x="26" y="20" fontWeight="700" fontSize="11">alt</T><T x="60" y="21" fontSize="11">[condition]</T><line x1="20" y1="58" x2="180" y2="58" stroke={INK} strokeWidth="1.4" strokeDasharray="7 4" /><T x="26" y="73" fontSize="11">[else]</T></>}</Mini> },
];

const classBoxMini = (name, attrs, methods, stereo, italic) => (
  <div className="w-44 border-2 border-slate-700 bg-white font-mono text-[11px] text-slate-800">
    <div className="py-1 text-center font-sans font-bold leading-tight">
      {stereo && <div className="text-[10px] font-normal italic">{stereo}</div>}
      <span className={italic ? 'italic' : ''}>{name}</span>
    </div>
    {attrs && <div className="border-t-2 border-slate-700 px-2 py-1">{attrs}</div>}
    {methods && <div className="border-t-2 border-slate-700 px-2 py-1">{methods}</div>}
  </div>
);
const MiniBoxes = ({ children }) => (
  <>
    <rect x="8" y="33" width="44" height="34" fill="#fff" stroke={INK} strokeWidth="1.8" /><T x="30" y="54" textAnchor="middle" fontSize="12" fontWeight="600">A</T>
    <rect x="148" y="33" width="44" height="34" fill="#fff" stroke={INK} strokeWidth="1.8" /><T x="170" y="54" textAnchor="middle" fontSize="12" fontWeight="600">B</T>
    {children}
  </>
);

const classSymbols = [
  { name: 'Class', def: 'A rectangle with three compartments: name, attributes (data) and operations (behaviour).', note: 'Top: name. Middle: attributes. Bottom: operations.',
    v: classBoxMini('Student', <div>- studentNo: String</div>, <div>+ cancelBooking(): void</div>) },
  { name: 'Abstract class / interface', def: 'A stereotype in guillemets marks special classes. An abstract class (italic name) cannot be instantiated; an interface lists operations only.',
    v: classBoxMini('User', <div>- email: String</div>, <div>+ login(): boolean</div>, '«abstract»', true) },
  { name: 'Visibility modifiers', def: 'A symbol before each member says who may access it. Attributes are usually private, operations public.',
    v: <div className="space-y-0.5 font-mono text-[12px] text-slate-800"><div><b className="text-indigo-700">+</b> public</div><div><b className="text-indigo-700">-</b> private</div><div><b className="text-indigo-700">#</b> protected</div><div><b className="text-indigo-700">~</b> package</div></div> },
  { name: 'Association', def: 'A solid line between classes that know about each other. Name it with a verb and add multiplicity at each end.',
    v: <Mini label="Association">{() => <><MiniBoxes><line x1="52" y1="50" x2="148" y2="50" stroke={INK} strokeWidth="1.8" /><T x="100" y="42" textAnchor="middle" fontSize="11" fontStyle="italic">makes</T><T x="58" y="45" fontSize="11" fontWeight="700" fill={ACC}>1</T><T x="144" y="45" textAnchor="end" fontSize="11" fontWeight="700" fill={ACC}>0..*</T></MiniBoxes></>}</Mini> },
  { name: 'Directed association', def: 'An association with an open arrowhead: A holds a reference to B, but B does not know about A.',
    v: <Mini label="Directed association">{(m) => <><MiniBoxes><line x1="52" y1="50" x2="148" y2="50" stroke={INK} strokeWidth="1.8" markerEnd={m('open')} /></MiniBoxes></>}</Mini> },
  { name: 'Generalization', def: 'A solid line with a hollow triangle at the parent. The child inherits attributes and operations (an “is-a” relationship).', note: 'Student is a User.',
    v: <Mini label="Generalization">{(m) => <><MiniBoxes><line x1="52" y1="50" x2="148" y2="50" stroke={INK} strokeWidth="1.8" markerEnd={m('tri')} /></MiniBoxes></>}</Mini> },
  { name: 'Aggregation', def: 'A hollow diamond at the “whole” end. The parts can exist independently of the whole (“has-a”, weak ownership).',
    v: <Mini label="Aggregation">{() => <><MiniBoxes><polygon points="52,50 64,43 76,50 64,57" fill="#fff" stroke={INK} strokeWidth="1.8" /><line x1="76" y1="50" x2="148" y2="50" stroke={INK} strokeWidth="1.8" /></MiniBoxes></>}</Mini> },
  { name: 'Composition', def: 'A filled diamond at the “whole” end. The parts cannot exist without the whole; deleting it deletes them.', note: 'A Lecturer owns their TimeSlots.',
    v: <Mini label="Composition">{() => <><MiniBoxes><polygon points="52,50 64,43 76,50 64,57" fill={INK} stroke={INK} strokeWidth="1.8" /><line x1="76" y1="50" x2="148" y2="50" stroke={INK} strokeWidth="1.8" /></MiniBoxes></>}</Mini> },
  { name: 'Dependency', def: 'A dashed arrow meaning A uses B temporarily (a parameter or local variable) and would be affected if B changed.',
    v: <Mini label="Dependency">{(m) => <><MiniBoxes><line x1="52" y1="50" x2="148" y2="50" stroke={INK} strokeWidth="1.8" strokeDasharray="6 4" markerEnd={m('open')} /></MiniBoxes></>}</Mini> },
  { name: 'Multiplicity', def: 'Numbers at the end of an association saying how many objects take part.',
    v: <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-[12px] text-slate-800"><b className="text-indigo-700">1</b><span>exactly one</span><b className="text-indigo-700">0..1</b><span>zero or one</span><b className="text-indigo-700">0..*</b><span>zero or more</span><b className="text-indigo-700">1..*</b><span>one or more</span></div> },
];

const chenSymbols = [
  { name: 'Entity', def: 'A rectangle for a thing about which we store data. Named with a singular noun in capitals.', note: 'STUDENT, LECTURER.',
    v: <Mini label="Entity">{() => <><rect x="50" y="28" width="100" height="44" fill="#fff" stroke={INK} strokeWidth="2.2" /><T x="100" y="55" textAnchor="middle" fontWeight="700">ENTITY</T></>}</Mini> },
  { name: 'Weak entity', def: 'A double rectangle. It has no key of its own and depends on an owner entity for identification.',
    v: <Mini label="Weak entity">{() => <><rect x="46" y="24" width="108" height="52" fill="#fff" stroke={INK} strokeWidth="2" /><rect x="52" y="30" width="96" height="40" fill="#fff" stroke={INK} strokeWidth="2" /><T x="100" y="55" textAnchor="middle" fontWeight="700">WEAK</T></>}</Mini> },
  { name: 'Attribute', def: 'An oval joined to its entity by a line. It describes one property.',
    v: <Mini label="Attribute">{() => <><ellipse cx="100" cy="50" rx="52" ry="22" fill="#fff" stroke={INK} strokeWidth="1.8" /><T x="100" y="54.5" textAnchor="middle">fullName</T></>}</Mini> },
  { name: 'Key attribute', def: 'The attribute text is underlined. Its value uniquely identifies each entity instance.',
    v: <Mini label="Key attribute">{() => <><ellipse cx="100" cy="50" rx="52" ry="22" fill="#fff" stroke={INK} strokeWidth="1.8" /><T x="100" y="54.5" textAnchor="middle" textDecoration="underline">studentNo</T></>}</Mini> },
  { name: 'Multi-valued attribute', def: 'A double oval. One entity instance can hold several values at once.', note: 'A student may have many phone numbers.',
    v: <Mini label="Multi-valued attribute">{() => <><ellipse cx="100" cy="50" rx="56" ry="26" fill="#fff" stroke={INK} strokeWidth="1.8" /><ellipse cx="100" cy="50" rx="50" ry="20" fill="#fff" stroke={INK} strokeWidth="1.8" /><T x="100" y="54.5" textAnchor="middle">phoneNo</T></>}</Mini> },
  { name: 'Derived attribute', def: 'A dashed oval. Its value is calculated from other attributes, so it is not stored.', note: 'duration = endTime − startTime.',
    v: <Mini label="Derived attribute">{() => <><ellipse cx="100" cy="50" rx="52" ry="22" fill="#fff" stroke={INK} strokeWidth="1.8" strokeDasharray="6 4" /><T x="100" y="54.5" textAnchor="middle">duration</T></>}</Mini> },
  { name: 'Relationship', def: 'A diamond between entities that names how they are associated, using a verb.',
    v: <Mini label="Relationship">{() => <><polygon points="35,50 100,14 165,50 100,86" fill="#fff" stroke={INK} strokeWidth="2" /><T x="100" y="54.5" textAnchor="middle" fontWeight="700">BOOKS</T></>}</Mini> },
  { name: 'Identifying relationship', def: 'A double diamond linking a weak entity to the owner that identifies it.',
    v: <Mini label="Identifying relationship">{() => <><polygon points="28,50 100,10 172,50 100,90" fill="#fff" stroke={INK} strokeWidth="2" /><polygon points="44,50 100,19 156,50 100,81" fill="#fff" stroke={INK} strokeWidth="2" /><T x="100" y="54.5" textAnchor="middle" fontWeight="700" fontSize="12">HAS</T></>}</Mini> },
  { name: 'Cardinality ratio', def: 'Labels on each line (1, N, M) state how many instances take part. Read them across the diamond.', note: 'Lecturer 1 : N TimeSlot.',
    v: <Mini label="Cardinality">{() => <><rect x="4" y="32" width="44" height="36" fill="#fff" stroke={INK} strokeWidth="1.8" /><polygon points="76,50 100,34 124,50 100,66" fill="#fff" stroke={INK} strokeWidth="1.8" /><rect x="152" y="32" width="44" height="36" fill="#fff" stroke={INK} strokeWidth="1.8" /><line x1="48" y1="50" x2="76" y2="50" stroke={INK} strokeWidth="1.8" /><line x1="124" y1="50" x2="152" y2="50" stroke={INK} strokeWidth="1.8" /><T x="56" y="43" fontWeight="700" fill={ACC} fontSize="14">1</T><T x="136" y="43" fontWeight="700" fill={ACC} fontSize="14">N</T></>}</Mini> },
  { name: 'Total participation', def: 'A double line means every instance of that entity must take part in the relationship. A single line means participation is optional.',
    v: <Mini label="Total participation">{() => <><rect x="8" y="32" width="50" height="36" fill="#fff" stroke={INK} strokeWidth="1.8" /><polygon points="130,50 154,34 178,50 154,66" fill="#fff" stroke={INK} strokeWidth="1.8" /><line x1="58" y1="46" x2="130" y2="46" stroke={INK} strokeWidth="1.8" /><line x1="58" y1="54" x2="130" y2="54" stroke={INK} strokeWidth="1.8" /></>}</Mini> },
];

const MiniTable = ({ name, rows }) => (
  <div className="w-52 overflow-hidden rounded border border-slate-300 bg-white text-[11px] shadow-sm">
    <div className="bg-slate-800 px-2 py-1 font-bold text-white">{name}</div>
    {rows.map((r) => (
      <div key={r.n} className="flex items-center gap-1.5 border-t border-slate-200 px-2 py-0.5">
        <span className="flex w-[62px] shrink-0 gap-0.5">{r.pk && <Badge k="PK" />}{r.fk && <Badge k="FK" />}</span>
        <span className={`font-mono ${r.pk ? 'font-bold' : ''} ${r.fk ? 'italic' : ''}`}>{r.n}</span>
        <span className="ml-auto font-mono text-slate-500">{r.t}</span>
      </div>
    ))}
  </div>
);

const schemaSymbols = [
  { name: 'Table (relation)', def: 'One table per entity. The header holds the table name; each row below is a column with its data type.',
    v: <MiniTable name="STUDENT" rows={[{ n: 'student_no', t: 'VARCHAR' }, { n: 'full_name', t: 'VARCHAR' }]} /> },
  { name: 'Primary key (PK)', def: 'The column (or columns) that uniquely identifies every row. It can never be NULL or repeated.',
    v: <MiniTable name="LECTURER" rows={[{ n: 'staff_no', t: 'VARCHAR', pk: 1 }, { n: 'department', t: 'VARCHAR' }]} /> },
  { name: 'Foreign key (FK)', def: 'A column that stores the primary key of a row in another table. It links the two tables and enforces referential integrity.',
    v: <MiniTable name="TIME_SLOT" rows={[{ n: 'slot_id', t: 'INT', pk: 1 }, { n: 'staff_no', t: 'VARCHAR', fk: 1 }]} /> },
  { name: 'Composite primary key', def: 'Two or more columns that together identify a row. Each column is marked PK.', note: 'A student can have many numbers, but never the same one twice.',
    v: <MiniTable name="STUDENT_PHONE" rows={[{ n: 'student_no', t: 'VARCHAR', pk: 1, fk: 1 }, { n: 'phone_no', t: 'VARCHAR', pk: 1 }]} /> },
  { name: 'Reference arrow', def: 'An arrow from a foreign key to the primary key it refers to. “N → 1” means many rows point to one row.',
    v: <Mini label="Reference arrow">{(m) => <><rect x="6" y="28" width="62" height="44" rx="3" fill="#fff" stroke={INK} strokeWidth="1.8" /><T x="37" y="54" textAnchor="middle" fontSize="11" fontWeight="700">child</T><rect x="132" y="28" width="62" height="44" rx="3" fill="#fff" stroke={INK} strokeWidth="1.8" /><T x="163" y="54" textAnchor="middle" fontSize="11" fontWeight="700">parent</T><line x1="68" y1="50" x2="130" y2="50" stroke={INK} strokeWidth="1.8" markerEnd={m('open')} /><T x="74" y="43" fontSize="11" fontWeight="700" fill={ACC}>N</T><T x="126" y="43" fontSize="11" fontWeight="700" fill={ACC} textAnchor="end">1</T></>}</Mini> },
  { name: 'Junction (link) table', def: 'A table that resolves a many-to-many relationship. It holds one FK to each side, plus any attributes of the relationship.', note: 'BOOKING links STUDENT and LECTURER.',
    v: <MiniTable name="BOOKING" rows={[{ n: 'booking_id', t: 'INT', pk: 1 }, { n: 'student_no', t: 'VARCHAR', fk: 1 }, { n: 'staff_no', t: 'VARCHAR', fk: 1 }]} /> },
  { name: 'Data types & constraints', def: 'Each column has a data type. Constraints such as NOT NULL, UNIQUE and CHECK keep the data valid.',
    v: <div className="space-y-0.5 font-mono text-[11.5px] text-slate-800"><div>email <b className="text-indigo-700">VARCHAR(120)</b></div><div className="text-slate-500">  UNIQUE NOT NULL</div><div>status <b className="text-indigo-700">VARCHAR(15)</b></div><div className="text-slate-500">  CHECK (status IN (...))</div></div> },
];

/* ========================= SSAD: DFD PRIMITIVES ========================= */

function GSProcess({ x, y, w, h, id, label, col = INK, fill = '#fff', size = 12.5 }) {
  const lines = label.split('\n');
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} stroke={col} strokeWidth="2" />
      <line x1={x} y1={y + 24} x2={x + w} y2={y + 24} stroke={col} strokeWidth="1.6" />
      <T x={x + w / 2} y={y + 17} textAnchor="middle" fontWeight="700" fill={col}>{id}</T>
      {lines.map((ln, i) => (
        <T key={ln} x={x + w / 2} y={y + 24 + (h - 24) / 2 + (i - (lines.length - 1) / 2) * 15 + 4.5} textAnchor="middle" fontWeight="600" fill={col} fontSize={size}>{ln}</T>
      ))}
    </g>
  );
}

function GSStore({ x, y, w, h, id, label, col = INK, fill = '#fff' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke="none" />
      <path d={`M${x + w} ${y} H${x} V${y + h} H${x + w}`} fill="none" stroke={col} strokeWidth="2" />
      <line x1={x + 38} y1={y} x2={x + 38} y2={y + h} stroke={col} strokeWidth="1.6" />
      <T x={x + 19} y={y + h / 2 + 4.5} textAnchor="middle" fontWeight="700" fill={col}>{id}</T>
      <T x={x + 38 + (w - 38) / 2} y={y + h / 2 + 4.5} textAnchor="middle" fontWeight="600" fill={col}>{label}</T>
    </g>
  );
}

function DfdEntity({ x, y, w, h, label, col = INK, fill = '#fff' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={col} strokeWidth="2.2" />
      <T x={x + w / 2} y={y + h / 2 + 4.5} textAnchor="middle" fontWeight="700" fill={col}>{label}</T>
    </g>
  );
}

function Flow({ d, label, lx, ly, col, k, m, anchor = 'middle' }) {
  return (
    <g>
      <path d={d} fill="none" stroke={col} strokeWidth="1.8" strokeLinejoin="round" markerEnd={m('fill', k)} />
      <T x={lx} y={ly} textAnchor={anchor} fontSize="12" fill={col} style={HALO}>{label}</T>
    </g>
  );
}

/* ========================= SSAD: DFD LEVEL 0 ========================= */

function Dfd0Diagram({ step }) {
  const c = (s) => (step === s ? ACC : INK);
  const k = (s) => (step === s ? 'a' : 'i');
  const f = (s) => (step === s ? ACC_SOFT : '#fff');
  return (
    <Svg w={900} h={190} label="Context diagram (DFD level 0) of the Student Consultation Booking System">
      {(m) => (
        <>
          {step >= 3 && (
            <>
              <Flow m={m} col={c(3)} k={k(3)} d="M150 60 H360" label="Booking Request" lx={255} ly={53} />
              <Flow m={m} col={c(3)} k={k(3)} d="M750 60 H540" label="Availability Slots" lx={645} ly={53} />
              <Flow m={m} col={c(3)} k={k(3)} d="M750 95 H540" label="Booking Decision" lx={645} ly={88} />
            </>
          )}
          {step >= 4 && (
            <>
              <Flow m={m} col={c(4)} k={k(4)} d="M360 95 H150" label="Availability List" lx={255} ly={88} />
              <Flow m={m} col={c(4)} k={k(4)} d="M360 130 H150" label="Booking Confirmation" lx={255} ly={123} />
              <Flow m={m} col={c(4)} k={k(4)} d="M540 130 H750" label="Booking Notification" lx={645} ly={123} />
            </>
          )}
          {step >= 2 && (
            <>
              <DfdEntity x={20} y={30} w={130} h={130} label="Student" col={c(2)} fill={f(2)} />
              <DfdEntity x={750} y={30} w={130} h={130} label="Lecturer" col={c(2)} fill={f(2)} />
            </>
          )}
          <GSProcess x={360} y={30} w={180} h={130} id="0" label={'Consultation\nBooking System'} col={c(1)} fill={f(1)} size={13.5} />
        </>
      )}
    </Svg>
  );
}

/* ========================= SSAD: DFD LEVEL 1 ========================= */

function Dfd1Diagram({ step }) {
  const c = (s) => (step === s ? ACC : INK);
  const k = (s) => (step === s ? 'a' : 'i');
  const f = (s) => (step === s ? ACC_SOFT : '#fff');
  const ext = step === 6 ? ACC : c(4);
  const extK = step === 6 ? 'a' : k(4);
  const int = c(5);
  const intK = k(5);
  return (
    <Svg w={940} h={600} label="Level 1 data flow diagram of the Student Consultation Booking System">
      {(m) => (
        <>
          {step >= 4 && (
            <g>
              <Flow m={m} col={ext} k={extK} d="M85 225 V90 H215" label="Availability Slots" lx={150} ly={82} />
              <Flow m={m} col={ext} k={extK} d="M795 245 H685" label="Booking Request" lx={740} ly={237} />
              <Flow m={m} col={ext} k={extK} d="M685 275 H795" label="Availability List" lx={740} ly={292} />
              <Flow m={m} col={ext} k={extK} d="M515 260 H150" label="Booking Notification" lx={332} ly={252} />
              <Flow m={m} col={ext} k={extK} d="M85 295 V430 H215" label="Booking Decision" lx={150} ly={422} />
              <Flow m={m} col={ext} k={extK} d="M300 472 V570 H860 V295" label="Booking Confirmation" lx={580} ly={562} />
            </g>
          )}
          {step >= 5 && (
            <g>
              <Flow m={m} col={int} k={intK} d="M385 90 H505" label="Slot Details" lx={445} ly={82} />
              <Flow m={m} col={int} k={intK} d="M600 112 V218" label="Free Slots" lx={608} ly={170} anchor="start" />
              <Flow m={m} col={int} k={intK} d="M600 302 V408" label="Pending Booking" lx={608} ly={360} anchor="start" />
              <Flow m={m} col={int} k={intK} d="M505 416 H385" label="Booking Details" lx={445} ly={409} />
              <Flow m={m} col={int} k={intK} d="M385 444 H505" label="Booking Status" lx={445} ly={461} />
            </g>
          )}
          {step >= 6 && (
            <T x="580" y="586" textAnchor="middle" fontSize="12" fontWeight="700" fill={ACC}>
              Highlighted: the six flows that cross the boundary are exactly the six on the context diagram
            </T>
          )}
          {step >= 3 && (
            <>
              <GSStore x={505} y={68} w={190} h={44} id="D1" label="Time Slots" col={c(3)} fill={f(3)} />
              <GSStore x={505} y={408} w={190} h={44} id="D2" label="Bookings" col={c(3)} fill={f(3)} />
            </>
          )}
          {step >= 2 && (
            <>
              <DfdEntity x={20} y={225} w={130} h={70} label="Lecturer" col={c(2)} fill={f(2)} />
              <DfdEntity x={795} y={225} w={130} h={70} label="Student" col={c(2)} fill={f(2)} />
            </>
          )}
          <GSProcess x={215} y={48} w={170} h={84} id="1.0" label={'Manage\nAvailability'} col={c(1)} fill={f(1)} />
          <GSProcess x={515} y={218} w={170} h={84} id="2.0" label={'Book\nConsultation'} col={c(1)} fill={f(1)} />
          <GSProcess x={215} y={388} w={170} h={84} id="3.0" label={'Process Booking\nDecision'} col={c(1)} fill={f(1)} />
        </>
      )}
    </Svg>
  );
}

/* ========================= SSAD: ACTIVITY DIAGRAM ========================= */

function ActivityDiagram({ step }) {
  const c = (s) => (step === s ? ACC : INK);
  const k = (s) => (step === s ? 'a' : 'i');
  const f = (s) => (step === s ? ACC_SOFT : '#fff');
  const lanes = [
    { n: 'Student', x: 20, w: 270 },
    { n: 'System', x: 290, w: 330 },
    { n: 'Lecturer', x: 620, w: 270 },
  ];
  const acts = [
    { x: 155, y: 130, w: 170, l: 'Select lecturer & slot', s: 2 },
    { x: 455, y: 130, w: 170, l: 'Check slot availability', s: 2 },
    { x: 155, y: 215, w: 170, l: 'Choose another slot', s: 2 },
    { x: 455, y: 300, w: 170, l: 'Create pending booking', s: 2 },
    { x: 455, y: 370, w: 170, l: 'Notify lecturer', s: 2 },
    { x: 755, y: 440, w: 170, l: 'Review request', s: 2 },
    { x: 455, y: 520, w: 170, l: 'Reject & notify student', s: 2 },
    { x: 455, y: 600, w: 170, l: 'Confirm booking', s: 2 },
    { x: 395, y: 700, w: 110, l: 'Update calendar', s: 5, size: 11.5 },
    { x: 515, y: 700, w: 110, l: 'Email student', s: 5, size: 11.5 },
  ];
  const flows = [
    { s: 3, d: 'M155 80 V108' }, { s: 3, d: 'M240 130 H370' }, { s: 3, d: 'M455 322 V348' }, { s: 3, d: 'M540 370 H755 V418' },
    { s: 4, d: 'M455 152 V187' }, { s: 4, d: 'M455 243 V278', g: '[yes]', gx: 463, gy: 266, a: 'start' },
    { s: 4, d: 'M395 215 H240', g: '[no]', gx: 318, gy: 207 }, { s: 4, d: 'M155 193 V152' },
    { s: 4, d: 'M755 462 V492' }, { s: 4, d: 'M693 520 H540', g: '[no]', gx: 616, gy: 512 },
    { s: 4, d: 'M755 548 V600 H540', g: '[yes]', gx: 763, gy: 578, a: 'start' },
    { s: 5, d: 'M455 622 V646' }, { s: 5, d: 'M395 654 V678' }, { s: 5, d: 'M515 654 V678' },
    { s: 5, d: 'M395 722 V752' }, { s: 5, d: 'M515 722 V752' },
    { s: 6, d: 'M455 760 V797' }, { s: 6, d: 'M370 520 H312 V810 H442' },
  ];
  return (
    <Svg w={910} h={850} label="Swimlane activity diagram of booking a consultation">
      {(m) => (
        <>
          {lanes.map((l, i) => (
            <g key={l.n}>
              <rect x={l.x} y="0" width={l.w} height="850" fill={i === 1 ? '#f8fafc' : '#fff'} stroke={c(1)} strokeWidth="1.8" />
              <rect x={l.x} y="0" width={l.w} height="34" fill={step === 1 ? ACC_SOFT : '#f1f5f9'} stroke={c(1)} strokeWidth="1.8" />
              <T x={l.x + l.w / 2} y="22" textAnchor="middle" fontWeight="700" fontSize="14" fill={c(1)}>{l.n}</T>
            </g>
          ))}
          {flows.filter((q) => step >= q.s).map((q) => (
            <g key={q.d}>
              <path d={q.d} fill="none" stroke={c(q.s)} strokeWidth="1.8" strokeLinejoin="round" markerEnd={m('fill', k(q.s))} />
              {q.g && <T x={q.gx} y={q.gy} textAnchor={q.a || 'middle'} fontSize="11.5" fontWeight="600" fill={c(q.s)} style={HALO}>{q.g}</T>}
            </g>
          ))}
          {step >= 5 && (
            <g fill={step === 5 ? ACC : INK}>
              <rect x="340" y="646" width="230" height="8" rx="2" />
              <rect x="340" y="752" width="230" height="8" rx="2" />
            </g>
          )}
          {step >= 2 && <circle cx="155" cy="70" r="10" fill={c(2)} />}
          {acts.filter((a) => step >= a.s).map((a) => (
            <g key={a.l}>
              <rect x={a.x - a.w / 2} y={a.y - 22} width={a.w} height="44" rx="14" fill={f(a.s)} stroke={c(a.s)} strokeWidth="1.8" />
              <T x={a.x} y={a.y + 4.5} textAnchor="middle" fill={c(a.s)} fontSize={a.size || 12.5}>{a.l}</T>
            </g>
          ))}
          {step >= 4 && (
            <>
              {[{ x: 455, y: 215, hw: 60, l: 'Slot free?' }, { x: 755, y: 520, hw: 62, l: 'Accepted?' }].map((d) => (
                <g key={d.l}>
                  <polygon points={`${d.x - d.hw},${d.y} ${d.x},${d.y - 28} ${d.x + d.hw},${d.y} ${d.x},${d.y + 28}`} fill={f(4)} stroke={c(4)} strokeWidth="1.8" />
                  <T x={d.x} y={d.y + 4} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={c(4)}>{d.l}</T>
                </g>
              ))}
            </>
          )}
          {step >= 6 && (
            <g>
              <circle cx="455" cy="810" r="13" fill="#fff" stroke={c(6)} strokeWidth="1.8" />
              <circle cx="455" cy="810" r="8" fill={c(6)} />
            </g>
          )}
        </>
      )}
    </Svg>
  );
}

/* ========================= SSAD SYMBOLS ========================= */

const dfd0Symbols = [
  { name: 'External entity', def: 'A person, organisation or system outside the boundary that sends data to the system or receives data from it. Drawn as a rectangle with a noun label.', note: 'Example: Student, Lecturer.',
    v: <Mini label="External entity">{() => <DfdEntity x={55} y={22} w={90} h={56} label="Student" />}</Mini> },
  { name: 'Process 0 (context)', def: 'On the context diagram the whole system is shown as one process. In Gane & Sarson notation it is a rounded rectangle with the number 0 in the top band.',
    v: <Mini label="Context process">{() => <GSProcess x={45} y={10} w={110} h={80} id="0" label={'Booking\nSystem'} />}</Mini> },
  { name: 'Data flow', def: 'An arrow showing data moving from one place to another. Label it with the data (a noun phrase), never an action.', note: 'Booking Request, not “Request booking”.',
    v: <Mini label="Data flow">{(m) => <><line x1="20" y1="56" x2="180" y2="56" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /><T x="100" y="46" textAnchor="middle" fontSize="12">Booking Request</T></>}</Mini> },
  { name: 'Yourdon–DeMarco style', def: 'Another common notation. The process is a circle, the data store is two parallel lines, and entities and flows are the same. Use whichever style your course uses, and use it consistently.',
    v: <Mini w={260} h={100} label="Yourdon process and data store">{() => <><circle cx="40" cy="50" r="30" fill="#fff" stroke={INK} strokeWidth="2" /><T x="40" y="54" textAnchor="middle" fontWeight="700">1</T><line x1="150" y1="34" x2="240" y2="34" stroke={INK} strokeWidth="2" /><line x1="150" y1="66" x2="240" y2="66" stroke={INK} strokeWidth="2" /><T x="195" y="54" textAnchor="middle" fontSize="12" fontWeight="600">Bookings</T><T x="102" y="54" textAnchor="middle" fontSize="11" fill={MUTED}>or</T></>}</Mini> },
  { name: 'Context diagram rules', def: 'The context diagram has exactly one process and no data stores. Data never moves directly between two entities, and every entity has at least one flow.',
    v: <ul className="list-disc space-y-1 pl-5 text-left text-[12.5px] text-slate-700"><li>One process, numbered 0</li><li>No data stores</li><li>Entity → entity is not allowed</li></ul> },
];

const dfd1Symbols = [
  { name: 'Process', def: 'An activity that transforms data. It has a number (1.0, 2.0) and a verb-plus-noun name. Every process needs at least one input and one output.', note: 'Example: 2.0 Book Consultation.',
    v: <Mini label="Process">{() => <GSProcess x={40} y={10} w={120} h={80} id="2.0" label={'Book\nConsultation'} />}</Mini> },
  { name: 'Data store', def: 'A place where data rests between processes, such as a file or database table. In Gane & Sarson it is an open-ended rectangle with an ID (D1, D2) at the left.', note: 'Data stores become tables in your schema.',
    v: <Mini label="Data store">{() => <GSStore x={20} y={30} w={160} h={40} id="D1" label="Time Slots" />}</Mini> },
  { name: 'Flows to and from a store', def: 'An arrow into a store means data is written; an arrow out means data is read. Stores never connect directly to entities or to other stores: a process always sits between.',
    v: <Mini label="Flows with a store">{(m) => <><GSProcess x={6} y={26} w={74} h={48} id="1.0" label="Save" size={11} /><GSStore x={115} y={34} w={80} h={32} id="D1" label="" /><line x1="80" y1="44" x2="114" y2="44" stroke={INK} strokeWidth="1.6" markerEnd={m('fill')} /><line x1="114" y1="58" x2="82" y2="58" stroke={INK} strokeWidth="1.6" markerEnd={m('fill')} /></>}</Mini> },
  { name: 'Numbering and levelling', def: 'Processes are numbered so each level can be traced to its parent. A level 1 process 2.0 can later be exploded into 2.1, 2.2 and 2.3 on a level 2 diagram.',
    v: <div className="space-y-0.5 font-mono text-[12px] text-slate-800"><div><b className="text-indigo-700">0</b> context diagram</div><div><b className="text-indigo-700">1.0, 2.0, 3.0</b> level 1</div><div><b className="text-indigo-700">2.1, 2.2</b> level 2 (inside 2.0)</div></div> },
  { name: 'Balancing', def: 'A child diagram must have the same inputs and outputs as its parent process. The flows crossing the boundary at level 1 must match the context diagram exactly.', note: 'Six flows in, six flows out of the boundary.',
    v: <Mini label="Balancing"><><rect x="30" y="20" width="60" height="60" rx="8" fill="#fff" stroke={INK} strokeWidth="2" /><T x="60" y="54" textAnchor="middle" fontWeight="700">0</T><T x="100" y="54" textAnchor="middle" fontSize="18" fill={ACC}>=</T><rect x="112" y="14" width="64" height="72" rx="8" fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="5 4" /><circle cx="130" cy="38" r="8" fill="#fff" stroke={INK} strokeWidth="1.6" /><circle cx="158" cy="62" r="8" fill="#fff" stroke={INK} strokeWidth="1.6" /></></Mini> },
  { name: 'Common errors', def: 'Check each process against these three mistakes before you finish.',
    v: <ul className="space-y-1 text-left text-[12px] leading-snug text-slate-700"><li><b>Black hole:</b> inputs but no outputs</li><li><b>Miracle:</b> outputs but no inputs</li><li><b>Grey hole:</b> outputs cannot be made from the inputs</li></ul> },
];

const activitySymbols = [
  { name: 'Initial node', def: 'A filled circle marking where the activity starts. A diagram has one initial node.',
    v: <Mini label="Initial node">{() => <circle cx="100" cy="50" r="14" fill={INK} />}</Mini> },
  { name: 'Action', def: 'A rounded rectangle for one step of work, named with a verb and a noun.', note: 'Example: Check slot availability.',
    v: <Mini label="Action">{() => <><rect x="30" y="28" width="140" height="44" rx="14" fill="#fff" stroke={INK} strokeWidth="1.8" /><T x="100" y="55" textAnchor="middle" fontSize="12.5">Check availability</T></>}</Mini> },
  { name: 'Control flow', def: 'An arrow showing which action happens next. Follow the arrows to read the workflow.',
    v: <Mini label="Control flow">{(m) => <><rect x="6" y="32" width="64" height="36" rx="12" fill="#fff" stroke={INK} strokeWidth="1.8" /><rect x="130" y="32" width="64" height="36" rx="12" fill="#fff" stroke={INK} strokeWidth="1.8" /><line x1="70" y1="50" x2="130" y2="50" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /></>}</Mini> },
  { name: 'Decision / merge', def: 'A diamond where the flow splits into alternatives. Each outgoing arrow carries a guard in square brackets, and only one path is taken.',
    v: <Mini label="Decision node">{(m) => <><polygon points="40,50 80,24 120,50 80,76" fill="#fff" stroke={INK} strokeWidth="1.8" /><line x1="120" y1="50" x2="190" y2="50" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /><T x="155" y="42" textAnchor="middle" fontSize="11.5" fontWeight="600">[yes]</T><line x1="80" y1="76" x2="80" y2="96" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /><T x="88" y="92" fontSize="11.5" fontWeight="600">[no]</T></>}</Mini> },
  { name: 'Fork and join', def: 'A thick bar that splits one flow into parallel flows (fork) or waits for all parallel flows to finish before continuing (join).',
    v: <Mini label="Fork and join">{(m) => <><line x1="100" y1="4" x2="100" y2="30" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /><rect x="50" y="30" width="100" height="7" rx="2" fill={INK} /><line x1="70" y1="37" x2="70" y2="60" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /><line x1="130" y1="37" x2="130" y2="60" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /><rect x="50" y="64" width="100" height="7" rx="2" fill={INK} /><line x1="100" y1="71" x2="100" y2="96" stroke={INK} strokeWidth="1.8" markerEnd={m('fill')} /></>}</Mini> },
  { name: 'Activity final node', def: 'A circle with a ring (a bullseye). When a flow reaches it, the whole activity ends.',
    v: <Mini label="Activity final node">{() => <><circle cx="100" cy="50" r="18" fill="#fff" stroke={INK} strokeWidth="1.8" /><circle cx="100" cy="50" r="11" fill={INK} /></>}</Mini> },
  { name: 'Swimlane (partition)', def: 'A vertical or horizontal band for each person, role or system. An action drawn inside a lane is that lane’s responsibility.',
    v: <Mini label="Swimlanes">{() => <><rect x="10" y="8" width="90" height="84" fill="#fff" stroke={INK} strokeWidth="1.6" /><rect x="100" y="8" width="90" height="84" fill="#f8fafc" stroke={INK} strokeWidth="1.6" /><rect x="10" y="8" width="90" height="22" fill="#f1f5f9" stroke={INK} strokeWidth="1.6" /><rect x="100" y="8" width="90" height="22" fill="#f1f5f9" stroke={INK} strokeWidth="1.6" /><T x="55" y="24" textAnchor="middle" fontSize="12" fontWeight="700">Student</T><T x="145" y="24" textAnchor="middle" fontSize="12" fontWeight="700">System</T></>}</Mini> },
];

/* ========================= MODULE CONTENT ========================= */

const MODULE_LIST = [
  {
    id: 'usecase', short: 'Use Case', title: 'UML Use Case Diagram', icon: Users, Diagram: UseCaseDiagram, symbols: useCaseSymbols,
    intro: 'A use case diagram shows what a system does from the outside. It lists the people and systems that use it (actors) and the goals they can achieve (use cases). You draw it early, to agree on scope with stakeholders before any design work.',
    remember: 'Describe what the user wants to achieve, never how the system does it internally.',
    steps: [
      { title: 'Identify the actors', body: 'Ask who uses the system or exchanges information with it. In our case study these are the Student, who books consultations, and the Lecturer, who accepts them. Draw each as a stickman with the role name underneath.', tip: 'An actor is a role, not a person: write “Student”, not “Paul”. External systems can be actors too.' },
      { title: 'Draw the system boundary', body: 'Draw a large rectangle and write the system name at the top: Consultation Booking System. Everything inside is what you are building. The actors stay outside.', tip: 'If you are unsure whether something belongs inside, ask: do we build it, or does it just talk to us?' },
      { title: 'Add the use cases', body: 'Inside the boundary, draw one oval for each goal an actor wants to reach. Name each one with a verb and a noun: Book Consultation, Check Availability, Reschedule Booking, Accept Booking, Cancel Booking and Manage Availability.', tip: 'Avoid names that describe screens or steps, like “Click Submit”. Describe goals.' },
      { title: 'Connect actors with associations', body: 'Draw a plain line from each actor to the use cases they take part in. The Student connects to Book Consultation and Cancel Booking. The Lecturer connects to Accept Booking and Manage Availability.', tip: 'Do not connect an actor to a use case that is only reached through «include» or «extend».' },
      { title: 'Add «include» and «extend»', body: 'Book Consultation always needs a Check Availability, so draw a dashed arrow from Book Consultation to Check Availability labelled «include». Rescheduling is optional, so draw a dashed arrow from Reschedule Booking to Book Consultation labelled «extend».', tip: 'Include points at the shared, mandatory behaviour. Extend points at the base use case being extended.' },
    ],
  },
  {
    id: 'sequence', short: 'Sequence', title: 'UML Sequence Diagram', icon: ArrowRightLeft, Diagram: SequenceDiagram, symbols: sequenceSymbols,
    intro: 'A sequence diagram shows how objects exchange messages over time to carry out one scenario. Participants sit side by side, and time runs from top to bottom. Use it to design and check the flow of a single use case.',
    remember: 'Read it top to bottom. A message lower on the page happens later.',
    steps: [
      { title: 'Place the participants', body: 'Take the Book Consultation use case and list who or what is involved. Along the top, draw the Student (an actor), then rectangles for :BookingSystem, :Database and :Lecturer.', tip: 'Order participants so that most messages travel to a neighbour; it avoids crossing lines.' },
      { title: 'Draw the lifelines', body: 'Drop a dashed vertical line from each participant. A lifeline represents that participant existing over time.', tip: 'Do not draw anything on a lifeline yet. Messages come next.' },
      { title: 'Add the calls in order', body: 'Draw solid arrows with filled heads, top to bottom: 1 requestConsultation, 2 checkAvailability, 4 notifyRequest, 5 acceptBooking and 6 saveBooking. Number each message and label it with an operation name.', tip: 'The arrow points to the participant that owns the operation being called.' },
      { title: 'Add the return messages', body: 'Draw dashed arrows with open heads for replies: 3 slotStatus from the Database and 7 bookingConfirmed back to the Student.', tip: 'Only show returns that matter. Leaving out obvious ones keeps the diagram readable.' },
      { title: 'Show the activation bars', body: 'Draw a thin rectangle on a lifeline from the moment a message arrives until that participant finishes. The BookingSystem stays active through the whole scenario, while the Database is only busy twice.', tip: 'A bar that begins at a message and ends at its return shows the call is still running.' },
      { title: 'Wrap choices in an alt fragment', body: 'Messages 4 to 7 only happen when the slot is free. Draw a frame labelled alt around them with the condition [slot available]. Add a dashed divider and an [else] branch with the message slotUnavailable.', tip: 'Other fragments you will meet: opt (optional), loop (repeat) and par (parallel).' },
    ],
  },
  {
    id: 'class', short: 'Class', title: 'UML Class Diagram', icon: Boxes, Diagram: ClassDiagram, symbols: classSymbols,
    intro: 'A class diagram describes the static structure of a system: its classes, their attributes and operations, and how the classes relate. It is the blueprint that developers turn into code.',
    remember: 'Attributes hold data, operations hold behaviour, and relationships say who knows whom.',
    steps: [
      { title: 'Find the classes', body: 'Underline the nouns in the requirements. We keep five: User (abstract), Student, Lecturer, Booking and TimeSlot. Draw a box for each and write its name in the top compartment.', tip: 'Class names are singular and capitalised. Abstract classes are written in italics.' },
      { title: 'Add the attributes', body: 'Add a middle compartment listing the data each class stores. Write them as visibility name: Type, for example - studentNo: String. Shared fields such as email go in User and are inherited.', tip: 'Make attributes private (-) by default and expose them through operations.' },
      { title: 'Add the operations', body: 'Add a bottom compartment with what each class can do: + requestBooking(slot): Booking, + acceptBooking(id): void, + reserve(): void and so on.', tip: 'Operations are usually public (+). Skip simple getters and setters to keep the diagram clear.' },
      { title: 'Show inheritance', body: 'Student and Lecturer both are users, so draw lines from each up to User and finish with a hollow triangle at User. They inherit userId, fullName, email, login() and logout().', tip: 'Test it with “is a”: a Student is a User. If it sounds wrong, it is not inheritance.' },
      { title: 'Add associations and multiplicity', body: 'One Student makes zero or more Bookings, and one Lecturer receives zero or more Bookings. Draw a line for each, name it with a verb and add multiplicity at both ends: 1 and 0..*.', tip: 'Read each end aloud: “one Student makes zero or more Bookings”.' },
      { title: 'Refine the relationships', body: 'A Lecturer offers TimeSlots that cannot exist without them, so use a filled diamond (composition) at Lecturer. A Booking points at the one TimeSlot it reserves, so use an arrow (directed association).', tip: 'If the part can outlive the whole, use a hollow diamond (aggregation) instead.' },
    ],
  },
  {
    id: 'er', short: 'ER (Chen)', title: 'ER Diagram (Chen Notation)', icon: Network, Diagram: ChenDiagram, symbols: chenSymbols,
    intro: 'An entity-relationship diagram models the data a system must store. In Chen notation entities are rectangles, attributes are ovals and relationships are diamonds. You draw it before designing tables.',
    remember: 'Chen notation puts everything in its own shape: even a relationship gets a diamond, and can have attributes of its own.',
    steps: [
      { title: 'Identify the entities', body: 'Find the things we need to store data about: STUDENT, LECTURER and TIME_SLOT. Draw each as a rectangle with a singular noun in capitals.', tip: 'Ask whether it is a thing we keep many records of. If so, it is likely an entity.' },
      { title: 'Add attributes and mark the keys', body: 'Draw an oval for each property and join it to its entity. Underline the key attribute that uniquely identifies each instance: studentNo, staffNo and slotId.', tip: 'Choose keys that never change. A name is a poor key; an ID is a good one.' },
      { title: 'Add special attributes', body: 'A student can have several phone numbers, so phoneNo is a multi-valued attribute (double oval). A slot’s duration is worked out from its start and end times, so it is a derived attribute (dashed oval).', tip: 'Multi-valued attributes become their own table later. Derived attributes are not stored at all.' },
      { title: 'Add the relationships', body: 'Draw a diamond for each association and join it to the entities on both sides. A STUDENT BOOKS a LECTURER, and a LECTURER OFFERS TIME_SLOTs.', tip: 'Name relationships with verbs so the diagram reads like a sentence: Student books Lecturer.' },
      { title: 'Label the cardinality and relationship attributes', body: 'A student can book many lecturers and vice versa, so BOOKS is N : M. A lecturer offers many slots, but each slot belongs to one lecturer, so OFFERS is 1 : N. Attach bookingDate, status and topic to BOOKS, because they describe the booking, not either entity.', tip: 'If an attribute needs both entities to make sense, it belongs on the relationship.' },
      { title: 'Show participation constraints', body: 'Every TIME_SLOT must belong to a lecturer, so draw a double line between OFFERS and TIME_SLOT. This is total participation. Single lines mean participation is optional.', tip: 'A lecturer may offer no slots yet, so that side stays a single line.' },
    ],
  },
  {
    id: 'schema', short: 'Schema', title: 'Relational Database Schema', icon: Table2, Diagram: SchemaDiagram, symbols: schemaSymbols,
    intro: 'A relational schema turns the ER diagram into tables, columns and keys that a database can implement. Each table has a primary key, and foreign keys link tables together.',
    remember: 'Every relationship in the ER diagram turns into either a foreign key or a new table.',
    steps: [
      { title: 'Map each strong entity to a table', body: 'STUDENT and LECTURER each become a table. Their simple attributes become columns, and the key attribute becomes the primary key (PK): student_no and staff_no.', tip: 'Use snake_case for columns and choose a data type for each one.' },
      { title: 'Give the multi-valued attribute its own table', body: 'A column cannot hold several phone numbers. Create STUDENT_PHONE with student_no (a foreign key) and phone_no. Together they form a composite primary key.', tip: 'Rule: multi-valued attribute → new table with a FK to the owner.' },
      { title: 'Map the 1 : N relationship', body: 'A lecturer offers many slots, so TIME_SLOT stores the foreign key staff_no on the “many” side. The derived duration is left out because it can be computed.', tip: 'Rule: put the FK on the N side. Derived attributes are not stored.' },
      { title: 'Turn the M : N relationship into a junction table', body: 'Students and lecturers have a many-to-many link, so create BOOKING. It has its own booking_id, two foreign keys (student_no and staff_no) and the relationship attributes bookingDate, status and topic.', tip: 'Rule: M : N relationship → new table holding a FK to each side plus its own attributes.' },
      { title: 'Draw the foreign-key references', body: 'Draw an arrow from each foreign key to the primary key it refers to, and mark N at the foreign-key end and 1 at the primary-key end. These links keep data consistent: a booking cannot point to a student who does not exist.', tip: 'Each FK column must use the same data type as the PK it points to.' },
    ],
  },
  {
    id: 'dfd0', short: 'DFD Level 0', title: 'DFD Level 0 (Context Diagram)', icon: CircleDot, Diagram: Dfd0Diagram, symbols: dfd0Symbols,
    intro: 'A context diagram is the highest-level data flow diagram. It shows the whole system as a single process and every external entity that exchanges data with it. It fixes the system boundary and lists the data that crosses it, without saying how the data is processed or stored.',
    remember: 'One process, no data stores. Show only what crosses the boundary.',
    steps: [
      { title: 'Draw the system as one process', body: 'Draw a single process, numbered 0, and name it after the system: Consultation Booking System. At this level you do not look inside it.', tip: 'Numbering it 0 lets its sub-processes be numbered 1.0, 2.0 and 3.0 on the next level.' },
      { title: 'Place the external entities', body: 'Add the people or systems outside the boundary that send data in or take data out: the Student and the Lecturer.', tip: 'An outside system you talk to, such as an email service, is also an external entity.' },
      { title: 'Add the incoming data flows', body: 'Draw arrows from entities into the process and label each with the data it carries: Booking Request from the Student, and Availability Slots and Booking Decision from the Lecturer.', tip: 'Label the data, not the action. Write Booking Request, not “Request a booking”.' },
      { title: 'Add the outgoing data flows', body: 'Draw arrows from the process back out: Availability List and Booking Confirmation to the Student, and Booking Notification to the Lecturer. Check that every entity has at least one flow and that there are no data stores.', tip: 'Data cannot flow straight from one entity to another. It must pass through a process.' },
    ],
  },
  {
    id: 'dfd1', short: 'DFD Level 1', title: 'DFD Level 1', icon: Layers, Diagram: Dfd1Diagram, symbols: dfd1Symbols,
    intro: 'A Level 1 diagram opens up the single process from the context diagram into its main sub-processes. It also shows the data stores where data rests between them. Everything that crossed the boundary at Level 0 must still cross it here. This is called balancing.',
    remember: 'Every process needs an input and an output. Every data store needs a flow in and a flow out.',
    steps: [
      { title: 'Break process 0 into sub-processes', body: 'List the main jobs the system does and give each a number and a verb-plus-noun name: 1.0 Manage Availability, 2.0 Book Consultation and 3.0 Process Booking Decision. Aim for between three and nine processes.', tip: 'Each use case on your use case diagram is a good candidate for a process.' },
      { title: 'Bring in the external entities', body: 'Copy the Lecturer and the Student from the context diagram. Do not add new ones. The boundary has not changed.', tip: 'New entities at this level are a sign that the context diagram was incomplete.' },
      { title: 'Add the data stores', body: 'Ask what data must be remembered between processes. Availability must survive until a student books it, and bookings must survive until they are decided. Add D1 Time Slots and D2 Bookings.', tip: 'Each store usually becomes an entity in your ER diagram and a table in your schema.' },
      { title: 'Connect the entities to the processes', body: 'Redraw each context-level flow so that it ends at the process that handles it. Availability Slots go to 1.0, Booking Request and Availability List go with 2.0, Booking Decision goes to 3.0, and Booking Notification and Booking Confirmation leave from 2.0 and 3.0.', tip: 'Keep the data flow names identical to Level 0. Balancing depends on it.' },
      { title: 'Connect the processes and data stores', body: 'Show how data moves inside the system. 1.0 writes Slot Details to D1, and D1 supplies Free Slots to 2.0. 2.0 writes a Pending Booking to D2. 3.0 reads Booking Details from D2 and writes back the Booking Status.', tip: 'A process always sits between a store and an entity. Never join them directly.' },
      { title: 'Check balancing and common errors', body: 'Count the flows that cross the boundary. The six highlighted flows match the six on the context diagram exactly. Then check each process for black holes (no output), miracles (no input) and grey holes (output that cannot come from its inputs).', tip: 'If a flow appears or disappears between levels, fix one of the diagrams.' },
    ],
  },
  {
    id: 'activity', short: 'Activity', title: 'Activity Diagram', icon: Workflow, Diagram: ActivityDiagram, symbols: activitySymbols,
    intro: 'An activity diagram models the workflow of a process: the actions performed, the decisions made and who is responsible for each action. In SSAD it documents the business process that the DFD processes support.',
    remember: 'Follow the arrows from the initial node. A diamond is a choice. A bar means things happening in parallel.',
    steps: [
      { title: 'Draw the swimlanes', body: 'Decide who is involved in booking a consultation and give each a vertical lane: Student, System and Lecturer. Every action will sit in the lane of whoever performs it.', tip: 'Put the lanes in the order the work moves between them, so arrows cross as few lanes as possible.' },
      { title: 'Add the initial node and the actions', body: 'Place a filled circle in the Student lane to start. Then list the actions in each lane: Select lecturer & slot, Check slot availability, Create pending booking, Notify lecturer, Review request, Confirm booking and so on.', tip: 'Name each action with a verb and a noun, and keep it to one step.' },
      { title: 'Connect the actions with control flows', body: 'Draw arrows from the initial node to the first action, and between actions that always follow one another: Select slot → Check availability, and Create pending booking → Notify lecturer → Review request.', tip: 'Every action needs exactly one way in and one way out unless it is part of a decision or a fork.' },
      { title: 'Add the decisions and guards', body: 'Checking availability has two outcomes, so add a diamond labelled Slot free? with the guards [yes] and [no]. [no] sends the student to choose another slot and loops back. After the lecturer reviews the request, add a second diamond, Accepted?, which leads to Confirm booking or Reject & notify student.', tip: 'Guards must cover every case and must not overlap.' },
      { title: 'Show parallel work with a fork and join', body: 'After Confirm booking, Update calendar and Email student can happen at the same time. Draw a fork bar to split the flow, and a join bar to bring it back together.', tip: 'A join waits for all of its incoming flows. A merge diamond waits for none.' },
      { title: 'Finish with the activity final node', body: 'Draw a bullseye at the bottom. Connect the join to it, and connect the rejection branch to it too. Any path that reaches the final node ends the whole activity.', tip: 'Walk every path from the initial node to the final node to check that none ends in the middle.' },
    ],
  },
];

const MODS = Object.fromEntries(MODULE_LIST.map((x) => [x.id, x]));

const SECTIONS = [
  { id: 'ooad', name: 'OOAD', full: 'Object-Oriented Analysis & Design', modules: ['usecase', 'sequence', 'class', 'er', 'schema'] },
  { id: 'ssad', name: 'SSAD', full: 'Structured Systems Analysis & Design', modules: ['usecase', 'dfd0', 'dfd1', 'activity', 'er', 'schema'] },
];

/* Extra guidance for modules that appear in both sections */
const SECTION_NOTES = {
  ssad: {
    usecase: 'In SSAD the use case diagram captures requirements before any data flow diagrams are drawn. Each use case usually turns into one or more processes on the Level 1 DFD.',
    er: 'In SSAD the ER diagram describes the data held in your DFD data stores: Time Slots (D1) and Bookings (D2).',
    schema: 'In SSAD the tables are the physical form of the Level 1 data stores, so every store should map to at least one table.',
  },
  ooad: {
    er: 'In OOAD the ER diagram is often drawn from the class diagram, to design how the persistent classes are stored.',
    schema: 'In OOAD the schema is usually derived from the class diagram: persistent classes become tables and associations become foreign keys.',
  },
};

/* ========================= UI ========================= */

function StepNavigator({ mod, step, setStep }) {
  const total = mod.steps.length;
  const cur = mod.steps[step - 1];
  const done = step === total;
  return (
    <section aria-label="Step-by-step case study" className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3 sm:px-6">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>Student Consultation Booking System</span>
          <span className="tabular-nums">Step {step} of {total}</span>
        </div>
        <ol className="flex items-center gap-1.5">
          {mod.steps.map((s, i) => {
            const n = i + 1;
            const state = n < step ? 'done' : n === step ? 'cur' : 'todo';
            return (
              <li key={s.title} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => setStep(n)}
                  aria-label={`Go to step ${n}: ${s.title}`}
                  aria-current={state === 'cur' ? 'step' : undefined}
                  className={`h-2 w-full rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                    state === 'todo' ? 'bg-slate-200 hover:bg-slate-300' : state === 'cur' ? 'bg-indigo-600' : 'bg-indigo-300 hover:bg-indigo-400'
                  }`}
                />
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-semibold text-slate-900">
            <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 align-middle font-sans text-sm text-white">{step}</span>
            {cur.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{cur.body}</p>
        </div>
        <div className="flex gap-2.5 self-start rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{cur.tip}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
        </button>
        {done ? (
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-sm font-medium text-emerald-700 sm:inline-flex"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Diagram complete</span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start over
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}

function CaseStudy({ mod, step, setStep }) {
  const { Diagram } = mod;
  return (
    <div className="space-y-4">
      <StepNavigator mod={mod} step={step} setStep={setStep} />
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5" aria-label="Diagram">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-semibold uppercase tracking-wider">{mod.title}</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-600" aria-hidden="true" /> Indigo marks what was added in this step
          </span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <Diagram step={step} />
          </div>
        </div>
      </section>
    </div>
  );
}

function Symbols({ mod }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {mod.symbols.map((s) => (
        <SymbolCard key={s.name} name={s.name} def={s.def} note={s.note}>{s.v}</SymbolCard>
      ))}
    </div>
  );
}

export default function DiagramWorkshop() {
  const [sectionId, setSectionId] = useState('ooad');
  const [activeId, setActiveId] = useState('usecase');
  const [tab, setTab] = useState('symbols');
  const [step, setStep] = useState(1);
  const [navOpen, setNavOpen] = useState(false);
  const section = SECTIONS.find((x) => x.id === sectionId);
  const mod = MODS[activeId];
  const position = section.modules.indexOf(activeId) + 1;
  const note = SECTION_NOTES[sectionId]?.[activeId];

  const go = (sec, id) => {
    setSectionId(sec); setActiveId(id); setStep(1); setTab('symbols'); setNavOpen(false);
    window.scrollTo?.({ top: 0 });
  };
  const clampStep = (n) => Math.max(1, Math.min(mod.steps.length, n));

  useEffect(() => {
    const onKey = (e) => {
      if (tab !== 'case' || e.target.closest?.('input, textarea, select')) return;
      if (e.key === 'ArrowRight') setStep((s) => Math.min(mod.steps.length, s + 1));
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(1, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tab, mod]);

  const nav = (
    <nav aria-label="Diagram modules" className="flex flex-col gap-5">
      {SECTIONS.map((sec) => (
        <div key={sec.id}>
          <div className="mb-1.5 px-1">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-300">{sec.name}</div>
            <div className="text-[11px] text-slate-500">{sec.full}</div>
          </div>
          <div className="flex flex-col gap-1">
            {sec.modules.map((id) => {
              const x = MODS[id];
              const Icon = x.icon;
              const on = sec.id === sectionId && id === activeId;
              return (
                <button
                  key={sec.id + id}
                  type="button"
                  onClick={() => go(sec.id, id)}
                  aria-current={on ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${on ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="truncate">{x.short}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-2.5 px-1">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-white"><GraduationCap className="h-5 w-5" aria-hidden="true" /></span>
      <div className="leading-tight">
        <div className="font-serif text-lg font-semibold text-white">Diagram Workshop</div>
        <div className="text-[11px] text-slate-400">Computing systems modelling</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 lg:flex" style={{ fontFamily: FONT }}>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-slate-900 px-4 py-3 lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setNavOpen((o) => !o)}
          aria-expanded={navOpen}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          className="rounded-lg p-2 text-slate-200 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      {navOpen && <div className="z-20 bg-slate-900 p-3 pb-4 lg:hidden">{nav}</div>}

      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 bg-slate-900 lg:block">
        <div className="sticky top-0 flex h-screen flex-col gap-6 overflow-y-auto p-5">
          {brand}
          {nav}
          <div className="mt-auto rounded-lg bg-slate-800 p-3 text-xs leading-relaxed text-slate-400">
            Every module follows one scenario: a <span className="font-semibold text-slate-200">Student Consultation Booking System</span> where students book time with lecturers.
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-5xl space-y-6">
          <header>
            <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-700">
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-800">{section.name}</span>
              <span>{section.full}</span>
              <span className="text-slate-400">· Module {position} of {section.modules.length}</span>
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl" style={{ textWrap: 'balance' }}>{mod.title}</h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-700">{mod.intro}</p>
            <p className="mt-3 flex max-w-3xl items-start gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <span><b className="text-slate-900">Key idea.</b> {mod.remember}</span>
            </p>
            {note && (
              <p className="mt-3 flex max-w-3xl items-start gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-900 ring-1 ring-indigo-200">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span><b>In {section.name}.</b> {note}</span>
              </p>
            )}
          </header>

          <div role="tablist" aria-label="Lesson view" className="inline-flex rounded-xl bg-slate-200 p-1">
            {[
              { id: 'symbols', label: 'Symbols Reference', Icon: Shapes },
              { id: 'case', label: 'Step-by-Step Case Study', Icon: ListOrdered },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{id === 'symbols' ? 'Symbols' : 'Case Study'}</span>
              </button>
            ))}
          </div>

          <div role="tabpanel">
            {tab === 'symbols'
              ? <Symbols mod={mod} />
              : <CaseStudy mod={mod} step={clampStep(step)} setStep={(n) => setStep(clampStep(n))} />}
          </div>
        </div>
      </main>
    </div>
  );
}
