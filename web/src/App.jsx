import React, { useCallback, useEffect, useRef, useState } from "react";

// ---------- API helpers ----------
async function api(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
  return data;
}

/** Runs a background job and follows its log until it finishes */
function useJob(onDone) {
  const [job, setJob] = useState(null);
  const timer = useRef(null);
  const start = useCallback(async (url, body) => {
    const { job: id } = await api(url, { method: "POST", body });
    clearInterval(timer.current);
    timer.current = setInterval(async () => {
      try {
        const j = await api(`/api/jobs/${id}`);
        setJob(j);
        if (j.status !== "running") {
          clearInterval(timer.current);
          onDone?.(j);
        }
      } catch { /* server restarting - keep polling */ }
    }, 1200);
    setJob({ id, status: "running", log: ["Starting..."] });
  }, [onDone]);
  useEffect(() => () => clearInterval(timer.current), []);
  return [job, start, () => setJob(null)];
}

const NAMES = { A: "Max", B: "Leo", C: "Mira", D: "Bruno", E: "Zara", F: "Victor" };

// ---------- New series form ----------
function NewSeries({ meta, onCreated }) {
  const [mode, setMode] = useState("title");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [hero, setHero] = useState("B");
  const [parts, setParts] = useState(10);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [job, start, clear] = useJob(useCallback((j) => { if (j.status === "done") onCreated(j.result.id); }, [onCreated]));
  const running = job?.status === "running";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try { await start("/api/generate", { mode, title, story, hero, parts, notes }); } catch (err) { setError(err.message); }
  };

  return (
    <section className="card">
      <h2>New series</h2>
      <div className="tabs">
        <button type="button" className={mode === "title" ? "on" : ""} onClick={() => setMode("title")}>Title only</button>
        <button type="button" className={mode === "story" ? "on" : ""} onClick={() => setMode("story")}>Title + my story</button>
      </div>
      <p className="hint">
        {mode === "title"
          ? "The AI invents the whole story from your title."
          : "Write the story in your own words. The AI keeps your events and only splits it into parts, adds cliffhangers and the A/B choices."}
      </p>
      <form onSubmit={submit}>
        <label>Title
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="I found my dad's secret second phone" autoFocus />
        </label>
        {mode === "story" && (
          <label>Your story
            <textarea rows={10} value={story} onChange={e => setStory(e.target.value)}
              placeholder="Write what happens from start to end. Names, twists, the ending - as much detail as you like." />
          </label>
        )}
        <div className="row">
          <label>Hero
            <select value={hero} onChange={e => setHero(e.target.value)}>
              {Object.entries(meta?.cast || {}).map(([k, v]) => <option key={k} value={k}>{k} - {v.split(",")[0]} ({NAMES[k]})</option>)}
            </select>
          </label>
          <label className="narrow">Parts
            <input type="number" min={1} max={10} value={parts} onChange={e => setParts(e.target.value)} />
          </label>
        </div>
        <label>Notes for the AI (optional)
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. set in India, ends with a twist about the brother" />
        </label>
        <button className="primary" disabled={running || !title.trim()}>{running ? "Writing..." : "Generate ⏎"}</button>
      </form>
      {error && <p className="error">{error}</p>}
      {job && <JobLog job={job} onClose={clear} />}
    </section>
  );
}

function JobLog({ job, onClose }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [job?.log?.length]);
  return (
    <div className={`log ${job.status}`}>
      <div className="log-head">
        <span>{job.status === "running" ? "⏳ Working..." : job.status === "done" ? "✅ Done" : "❌ Failed"}</span>
        {job.status !== "running" && onClose && <button className="link" onClick={onClose}>close</button>}
      </div>
      <pre ref={ref}>{(job.log || []).slice(-60).join("\n")}</pre>
    </div>
  );
}

// ---------- Queue ----------
function Queue({ data, onOpen, onChanged }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [git, setGit] = useState([]);
  const [job, start, clear] = useJob(useCallback(() => { onChanged(); refreshGit(); }, [onChanged]));
  const queue = order || data.queue;
  const dirty = !!order;

  const refreshGit = useCallback(() => api("/api/git").then(d => setGit(d.changes)).catch(() => {}), []);
  useEffect(() => { refreshGit(); }, [data, refreshGit]);
  useEffect(() => { setOrder(null); }, [data]);

  const move = (i, d) => {
    const next = [...queue];
    const j = i + d;
    if (j < 0 || j >= next.length || next[j].status !== "waiting" || next[i].status !== "waiting") return;
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };
  const remove = (i) => setOrder(queue.filter((_, k) => k !== i));
  const add = (d) => setOrder([...queue, { ...d, status: "waiting", uploaded: 0 }]);
  const save = async () => {
    setError("");
    try { await api("/api/queue", { method: "PUT", body: { files: queue.map(q => q.file) } }); setOrder(null); onChanged(); refreshGit(); }
    catch (err) { setError(err.message); }
  };

  const inQueue = new Set(queue.map(q => q.id));
  return (
    <section className="card">
      <h2>Upload queue <span className="sub">3 parts a day, top to bottom</span></h2>
      <ol className="queue">
        {queue.map((q, i) => (
          <li key={q.id} className={q.status}>
            <button className="link title" onClick={() => onOpen(q.id)}>{q.title}</button>
            <span className="badge">{q.status === "done" ? "done" : q.status === "current" ? `uploading · ${q.uploaded}/${q.parts}` : `${q.parts} parts`}</span>
            {q.status === "waiting" && (
              <span className="tools">
                <button onClick={() => move(i, -1)} title="Move up">↑</button>
                <button onClick={() => move(i, 1)} title="Move down">↓</button>
                <button onClick={() => remove(i)} title="Remove from queue">✕</button>
              </span>
            )}
          </li>
        ))}
      </ol>
      {data.drafts.filter(d => !inQueue.has(d.id)).length > 0 && (
        <>
          <h3>Drafts</h3>
          <ul className="queue drafts">
            {data.drafts.filter(d => !inQueue.has(d.id)).map(d => (
              <li key={d.id}>
                <button className="link title" onClick={() => onOpen(d.id)}>{d.title}</button>
                <span className="badge">{d.generated ? "AI" : "script"} · {d.parts} parts</span>
                <span className="tools"><button onClick={() => add(d)} title="Add to the end of the queue">+ queue</button></span>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="row actions">
        <button className="primary" disabled={!dirty} onClick={save}>Save queue</button>
        {dirty && <button onClick={() => setOrder(null)}>Undo</button>}
        <button className="push" disabled={dirty || !git.length || job?.status === "running"}
          onClick={() => start("/api/publish", { message: "Update series from the writer page" })}
          title={git.length ? git.join("\n") : "No story changes to push"}>
          Push to GitHub {git.length ? `(${git.length})` : ""}
        </button>
      </div>
      <p className="hint">Pushing sends only the story files and the queue. GitHub then uploads them on schedule - your PC can be off.</p>
      {error && <p className="error">{error}</p>}
      {job && <JobLog job={job} onClose={clear} />}
    </section>
  );
}

// ---------- Editor ----------
function Editor({ id, meta, onSaved, onDeleted }) {
  const [data, setData] = useState(null);
  const [series, setSeries] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(0);
  const [video, setVideo] = useState(null);

  const load = useCallback(() => api(`/api/series/${id}`).then(d => { setData(d); setSeries(d.series); setDirty(false); }).catch(e => setError(e.message)), [id]);
  useEffect(() => { setVideo(null); setOpen(0); load(); }, [load]);

  const [job, start, clear] = useJob(useCallback((j) => {
    if (j.type === "preview" && j.status === "done") setVideo(j.result.video);
    if (j.type === "rewrite" && j.status === "done") load();
  }, [load]));

  if (error) return <section className="card"><p className="error">{error}</p></section>;
  if (!series) return <section className="card">Loading...</section>;
  const editable = data.editable;
  const check = data.check;

  const update = (fn) => { setSeries(s => { const c = structuredClone(s); fn(c); return c; }); setDirty(true); };
  const save = async () => {
    setError("");
    try { const r = await api(`/api/series/${id}`, { method: "PUT", body: { series } }); setData(d => ({ ...d, check: r.check })); setDirty(false); onSaved(); }
    catch (e) { setError(e.message); }
  };
  const remove = async () => {
    if (!confirm(`Delete the draft "${series.title}"?`)) return;
    try { await api(`/api/series/${id}`, { method: "DELETE" }); onDeleted(); } catch (e) { setError(e.message); }
  };

  return (
    <section className="card editor">
      <div className="editor-head">
        <div>
          {editable
            ? <input className="big" value={series.title} onChange={e => update(s => { s.title = e.target.value; })} />
            : <h2>{series.title}</h2>}
          <div className="sub">{series.id} · hero {series.hero} · {series.parts.length} parts {editable ? "" : "· hand-written (read only)"}</div>
        </div>
        <div className="row">
          {editable && <button className="primary" disabled={!dirty} onClick={save}>{dirty ? "Save changes" : "Saved"}</button>}
          {editable && <button className="danger" onClick={remove}>Delete</button>}
        </div>
      </div>
      {editable && (
        <label>YouTube description
          <textarea rows={2} value={series.description || ""} onChange={e => update(s => { s.description = e.target.value; })} />
        </label>
      )}
      <div className={`checks ${check.errors.length ? "bad" : "good"}`}>
        {check.errors.length ? `❌ ${check.errors.length} problem(s) - fix before queueing` : "✅ Passes all checks"}
        {check.warnings.length > 0 && ` · ⚠️ ${check.warnings.length} long part(s)`}
        {dirty && " · (checks update when you save)"}
        {check.errors.length > 0 && <ul>{check.errors.slice(0, 8).map((e, i) => <li key={i}>{e}</li>)}</ul>}
      </div>
      {error && <p className="error">{error}</p>}
      {job && <JobLog job={job} onClose={clear} />}
      {video && (
        <div className="preview">
          <video src={video} controls autoPlay />
          <button className="link" onClick={() => setVideo(null)}>close preview</button>
        </div>
      )}

      {series.parts.map((part, pi) => (
        <div key={pi} className={`part ${open === pi ? "open" : ""}`}>
          <div className="part-head" onClick={() => setOpen(open === pi ? -1 : pi)}>
            <b>Part {pi + 1}</b> {part.title}
            <span className="sub"> · ~{check.parts[pi]?.seconds ?? "?"}s{check.parts[pi]?.errors.length ? ` · ❌ ${check.parts[pi].errors.length}` : ""}</span>
          </div>
          {open === pi && (
            <PartEditor part={part} index={pi} meta={meta} editable={editable}
              prevChoice={pi > 0 ? series.parts[pi - 1].choice : null}
              onChange={(fn) => update(s => fn(s.parts[pi]))}
              busy={job?.status === "running"}
              onPreview={() => (dirty ? setError("Save your changes before previewing") : start(`/api/series/${id}/preview`, { part: pi + 1 }).catch(e => setError(e.message)))}
              onRewrite={series.generated ? () => {
                if (dirty) return setError("Save your changes first");
                if (confirm(`Rewrite part ${pi + 1} with AI? Your edits to this part will be replaced.`)) start(`/api/series/${id}/parts/${pi + 1}/rewrite`).catch(e => setError(e.message));
              } : null} />
          )}
        </div>
      ))}
    </section>
  );
}

function PartEditor({ part, index, meta, editable, prevChoice, onChange, onPreview, onRewrite, busy }) {
  const ro = !editable;
  const set = (fn) => onChange(fn);
  return (
    <div className="part-body">
      <div className="row">
        <label>Title<input disabled={ro} value={part.title} onChange={e => set(p => { p.title = e.target.value; })} /></label>
        {index > 0 && (
          <label className="narrow">Continues with
            <select disabled={ro} value={part.follows || ""} onChange={e => set(p => { p.follows = e.target.value; })}>
              <option value="a">A: {prevChoice?.a}</option>
              <option value="b">B: {prevChoice?.b}</option>
            </select>
          </label>
        )}
      </div>
      <label>Hook (on-screen headline - *stars* = yellow)<input disabled={ro} value={part.hook} onChange={e => set(p => { p.hook = e.target.value; })} /></label>

      {part.segments.map((seg, si) => (
        <div key={si} className="segment">
          <div className="row seg-head">
            <label className="narrow">Place
              <select disabled={ro} value={seg.scene} onChange={e => set(p => { p.segments[si].scene = e.target.value; })}>
                {meta.scenes.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="check"><input type="checkbox" disabled={ro} checked={!!seg.night} onChange={e => set(p => { p.segments[si].night = e.target.checked; })} /> night</label>
            <label>On screen (left to right)
              <div className="cast">
                {meta.characters.map(c => (
                  <button type="button" key={c} disabled={ro} className={seg.cast.includes(c) ? "on" : ""}
                    onClick={() => set(p => {
                      const cast = p.segments[si].cast;
                      if (cast.includes(c)) { if (cast.length > 1) cast.splice(cast.indexOf(c), 1); }
                      else if (cast.length < 3) cast.push(c);
                    })}>{c} {NAMES[c]}</button>
                ))}
              </div>
            </label>
            {editable && part.segments.length > 1 && <button className="link danger" onClick={() => set(p => { p.segments.splice(si, 1); })}>remove place</button>}
          </div>
          {seg.lines.map((line, li) => (
            <LineEditor key={li} line={line} cast={seg.cast} meta={meta} ro={ro}
              onChange={(fn) => set(p => fn(p.segments[si].lines[li]))}
              onMove={(d) => set(p => { const L = p.segments[si].lines; const j = li + d; if (j >= 0 && j < L.length) [L[li], L[j]] = [L[j], L[li]]; })}
              onDelete={() => set(p => { p.segments[si].lines.splice(li, 1); })} />
          ))}
          {editable && (
            <div className="row">
              <button onClick={() => set(p => { p.segments[si].lines.push({ speaker: "N", text: "", focus: seg.cast[0], emotion: "neutral" }); })}>+ narrator line</button>
              <button onClick={() => set(p => { p.segments[si].lines.push({ speaker: seg.cast[0], text: "", emotion: "neutral" }); })}>+ character line</button>
            </div>
          )}
        </div>
      ))}
      {editable && <button onClick={() => set(p => { p.segments.push({ scene: "home", night: false, cast: [...p.segments[p.segments.length - 1].cast], lines: [{ speaker: "N", text: "", emotion: "neutral" }] }); })}>+ new place</button>}

      <div className="choice">
        <label>A/B question<input disabled={ro} value={part.choice?.question || ""} onChange={e => set(p => { p.choice.question = e.target.value; })} /></label>
        <div className="row">
          <label><span className="a">A</span><input disabled={ro} value={part.choice?.a || ""} onChange={e => set(p => { p.choice.a = e.target.value; })} /></label>
          <label><span className="b">B</span><input disabled={ro} value={part.choice?.b || ""} onChange={e => set(p => { p.choice.b = e.target.value; })} /></label>
        </div>
      </div>
      <div className="row actions">
        <button disabled={busy} onClick={onPreview}>▶ Preview this part</button>
        {editable && onRewrite && <button disabled={busy} onClick={onRewrite}>✨ Rewrite with AI</button>}
      </div>
    </div>
  );
}

function LineEditor({ line, cast, meta, ro, onChange, onMove, onDelete }) {
  const speakers = ["N", ...cast, "V"];
  return (
    <div className={`line sp-${line.speaker}`}>
      <select disabled={ro} value={line.speaker} title="Who says it" onChange={e => onChange(l => {
        l.speaker = e.target.value;
        if (l.speaker === "V") { l.voiceOf = l.voiceOf || "robot"; l.fx = l.voiceOf === "robot" ? "robot" : "radio"; delete l.emotion; delete l.focus; }
        else { l.emotion = l.emotion || "neutral"; if (l.fx !== "shake") delete l.fx; delete l.voiceOf; if (l.speaker === "N") l.focus = l.focus || cast[0]; else delete l.focus; }
      })}>
        {speakers.map(s => <option key={s} value={s}>{s === "N" ? "Narrator" : s === "V" ? "Offscreen" : `${s} ${NAMES[s]}`}</option>)}
      </select>
      {line.speaker === "V" ? (
        <select disabled={ro} value={line.voiceOf} title="Whose voice" onChange={e => onChange(l => { l.voiceOf = e.target.value; l.fx = l.voiceOf === "robot" ? "robot" : l.voiceOf === "child" ? "echo" : "radio"; })}>
          <option value="robot">text / app</option><option value="radio">news / radio</option><option value="child">ghost child</option>
          {meta.characters.map(c => <option key={c} value={c}>phone: {NAMES[c]}</option>)}
        </select>
      ) : (
        <select disabled={ro} value={line.emotion} title="Face" onChange={e => onChange(l => { l.emotion = e.target.value; })}>
          {meta.emotions.map(m => <option key={m}>{m}</option>)}
        </select>
      )}
      {line.speaker === "N" && (
        <select disabled={ro} value={line.focus || cast[0]} title="Camera shows" onChange={e => onChange(l => { l.focus = e.target.value; })}>
          {cast.map(c => <option key={c} value={c}>📷 {NAMES[c]}</option>)}
        </select>
      )}
      <textarea disabled={ro} rows={Math.max(1, Math.ceil((line.text || "").length / 70))} value={line.text} onChange={e => onChange(l => { l.text = e.target.value; })} />
      {!ro && (
        <span className="tools">
          <button title="Camera shake" className={line.fx === "shake" ? "on" : ""} onClick={() => onChange(l => { if (l.speaker === "V") return; l.fx = l.fx === "shake" ? undefined : "shake"; })}>💥</button>
          <button onClick={() => onMove(-1)} title="Up">↑</button>
          <button onClick={() => onMove(1)} title="Down">↓</button>
          <button onClick={onDelete} title="Delete">✕</button>
        </span>
      )}
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [meta, setMeta] = useState(null);
  const [queue, setQueue] = useState({ queue: [], drafts: [] });
  // The open series is kept in the address (#series-id) so a refresh or a link reopens it
  const [selected, setSelectedState] = useState(() => decodeURIComponent(location.hash.slice(1)) || null);
  const setSelected = useCallback((id) => { setSelectedState(id); history.replaceState(null, "", id ? `#${id}` : " "); }, []);
  const [error, setError] = useState("");

  const refresh = useCallback(() => api("/api/queue").then(setQueue).catch(e => setError(e.message)), []);
  useEffect(() => { api("/api/meta").then(setMeta).catch(e => setError(e.message)); refresh(); }, [refresh]);

  if (error && !meta) return <div className="app"><p className="error">Can't reach the local server: {error}. Start it with <code>npm run app</code>.</p></div>;
  if (!meta) return <div className="app">Loading...</div>;

  return (
    <div className="app">
      <header><h1>🎬 Series Writer</h1><span className="sub">Write a "What would you do?" series → check → preview → queue → push</span></header>
      <div className="layout">
        <aside>
          <NewSeries meta={meta} onCreated={(id) => { refresh(); setSelected(id); }} />
          <Queue data={queue} onOpen={setSelected} onChanged={refresh} />
        </aside>
        <main>
          {selected
            ? <Editor key={selected} id={selected} meta={meta} onSaved={refresh} onDeleted={() => { setSelected(null); refresh(); }} />
            : <section className="card empty">Pick a series from the queue, or write a new one.</section>}
        </main>
      </div>
    </div>
  );
}
