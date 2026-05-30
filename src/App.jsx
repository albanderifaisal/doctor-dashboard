import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jrgnmwwjwaqfcerskixm.supabase.co";
const SUPABASE_KEY = "sb_publishable_YA9APL5hjpALqOYNXt4fjg_amRWuHw5";
const ADMIN_EMAIL = "almutairial2@mngha.med.sa";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TEAL = "#0F6E56";
const TEAL_LIGHT = "#E1F5EE";

const sectionTabs = [
  { key: "overview", label: "Overview", icon: "ti-layout-dashboard" },
  { key: "personal", label: "Personal", icon: "ti-user" },
  { key: "professional", label: "Professional", icon: "ti-briefcase-medical" },
  { key: "education", label: "Education", icon: "ti-school" },
  { key: "clinical", label: "Clinical", icon: "ti-activity" },
  { key: "administrative", label: "Administrative", icon: "ti-clipboard-list" },
  { key: "evaluation", label: "Evaluation", icon: "ti-star" },
];

function Badge({ children }) {
  const v = String(children || "");
  let bg, color;
  if (["Active", "Approved", "Yes", "Excellent", "Compliant"].includes(v)) { bg = "#E1F5EE"; color = "#085041"; }
  else if (["Pending", "Good", "Very Good"].includes(v)) { bg = "#FAEEDA"; color = "#633806"; }
  else if (["Inactive", "Rejected"].includes(v)) { bg = "#FCEBEB"; color = "#791F1F"; }
  else { bg = "#F1EFE8"; color = "#444441"; }
  return <span style={{ background: bg, color, fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 99 }}>{children || "—"}</span>;
}

function Avatar({ name, size = 44 }) {
  const parts = (name || "DR").split(" ");
  const initials = parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: TEAL_LIGHT, color: TEAL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 500, flexShrink: 0 }}>
      {initials.toUpperCase()}
    </div>
  );
}

function Field({ label, value, editable, onChange }) {
  return (
    <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px" }}>
      <p style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", margin: "0 0 5px" }}>{label}</p>
      {editable
        ? <input value={value || ""} onChange={e => onChange(e.target.value)} style={{ width: "100%", fontSize: 13, fontWeight: 500, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 6, padding: "5px 8px" }} />
        : <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>{value || "—"}</p>}
    </div>
  );
}

// LOGIN PAGE
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      let result;
      if (isSignup) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }
      if (result.error) setError(result.error.message);
      else onLogin(result.data.user);
    } catch (e) {
      setError("حدث خطأ، حاول مرة ثانية");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf9" }}>
      <div style={{ background: "white", borderRadius: 16, border: "0.5px solid #e0e0e0", padding: 40, width: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: TEAL_LIGHT, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <i className="ti ti-building-hospital" style={{ fontSize: 28, color: TEAL }} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px" }}>Doctor Profile System</h1>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{isSignup ? "إنشاء حساب جديد" : "تسجيل الدخول"}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          {error && <p style={{ color: "#c0392b", fontSize: 13, margin: 0, background: "#fdf0f0", padding: "8px 12px", borderRadius: 8 }}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading} style={{ background: TEAL, color: "white", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 4 }}>
            {loading ? "جاري التحميل..." : isSignup ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
          <button onClick={() => setIsSignup(!isSignup)} style={{ background: "transparent", border: "none", color: TEAL, fontSize: 13, cursor: "pointer", padding: 0 }}>
            {isSignup ? "عندي حساب ← تسجيل دخول" : "ما عندي حساب ← إنشاء حساب"}
          </button>
        </div>
      </div>
    </div>
  );
}

// DOCTOR FORM (for adding/editing)
function DoctorForm({ doctor, onSave, onCancel, isAdmin }) {
  const [form, setForm] = useState(doctor || {
    doctor_id: "", full_name: "", job_title: "", specialty: "", department: "",
    gender: "Male", phone: "", email: "", city: "", nationality: "Saudi",
    years_experience: "", status: "Active", license_number: "", scfhs_classification: "Specialist",
    hospital: "", clinic: "", working_hours: "", languages: "Arabic, English",
    joining_date: "", contract_type: "Full Time", saudi_board: "", international_board: "",
    bachelor: "", master: "", fellowship: "", subspecialty: "", courses: "",
    bls_acls: "", cme_hours: "", research: "", patients_per_day: "", emergency_cases: "",
    clinical_performance: "", on_call: "", approval_status: "Pending", shift_type: "Mixed",
    availability: "Available", eval_year1: "", eval_year2: "", eval_year3: "",
    eval_year4: "", eval_year5: "", eval_avg: "", eval_status: ""
  });

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const personalFields = [
    ["doctor_id","Doctor ID"], ["full_name","Full Name"], ["job_title","Job Title"],
    ["specialty","Specialty"], ["department","Department"], ["gender","Gender"],
    ["phone","Phone"], ["email","Email"], ["city","City / Branch"],
    ["nationality","Nationality"], ["years_experience","Years of Experience"], ["status","Status"]
  ];
  const professionalFields = [
    ["license_number","License Number"], ["scfhs_classification","SCFHS Classification"],
    ["hospital","Hospital"], ["clinic","Clinic"], ["working_hours","Working Hours"],
    ["languages","Languages"], ["joining_date","Joining Date"], ["contract_type","Contract Type"]
  ];
  const educationFields = [
    ["saudi_board","Saudi Board"], ["international_board","International Board"],
    ["bachelor","Bachelor Degree"], ["master","Master Degree"], ["fellowship","Fellowship"],
    ["subspecialty","Subspecialty"], ["courses","Courses"], ["bls_acls","BLS / ACLS / PALS"],
    ["cme_hours","CME Hours"], ["research","Research & Publications"]
  ];
  const clinicalFields = [
    ["patients_per_day","Patients Per Day"], ["emergency_cases","Emergency Cases"],
    ["clinical_performance","Clinical Performance"], ["on_call","On-Call Duties"]
  ];
  const adminFields = [
    ["approval_status","Approval Status"], ["shift_type","Shift Type"],
    ["availability","Availability"]
  ];
  const evalFields = [
    ["eval_year1","Year 1"], ["eval_year2","Year 2"], ["eval_year3","Year 3"],
    ["eval_year4","Year 4"], ["eval_year5","Year 5"], ["eval_avg","Average Score"], ["eval_status","Status"]
  ];

  function Section({ title, fields }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, color: TEAL, margin: "0 0 12px", borderBottom: `1px solid ${TEAL_LIGHT}`, paddingBottom: 8 }}>{title}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {fields.map(([key, label]) => <Field key={key} label={label} value={form[key]} editable={true} onChange={set(key)} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>{doctor ? "تعديل بيانات الطبيب" : "إضافة طبيب جديد"}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", fontSize: 13 }}>إلغاء</button>
          <button onClick={() => onSave(form)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: TEAL, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>حفظ</button>
        </div>
      </div>
      <Section title="المعلومات الشخصية" fields={personalFields} />
      <Section title="المعلومات المهنية" fields={professionalFields} />
      <Section title="التعليم والمؤهلات" fields={educationFields} />
      <Section title="الأداء السريري" fields={clinicalFields} />
      <Section title="الإدارة" fields={adminFields} />
      <Section title="التقييم السنوي" fields={evalFields} />
    </div>
  );
}

// DOCTOR PROFILE VIEW
function DoctorProfile({ doctor, isAdmin, onEdit }) {
  const [activeSection, setActiveSection] = useState("overview");

  const overviewCards = [
    { key: "personal", label: "Personal Information", desc: "Contact details and info", icon: "ti-user" },
    { key: "professional", label: "Professional", desc: "License and classification", icon: "ti-briefcase-medical" },
    { key: "education", label: "Education", desc: "Degrees and certifications", icon: "ti-school" },
    { key: "clinical", label: "Clinical", desc: "Patients and performance", icon: "ti-activity" },
    { key: "administrative", label: "Administrative", desc: "Schedule and availability", icon: "ti-clipboard-list" },
    { key: "evaluation", label: "Evaluation", desc: "Annual performance scores", icon: "ti-star" },
  ];

  const personalFields = [["doctor_id","Doctor ID"],["full_name","Full Name"],["job_title","Job Title"],["specialty","Specialty"],["department","Department"],["gender","Gender"],["phone","Phone"],["email","Email"],["city","City / Branch"],["nationality","Nationality"],["years_experience","Years of Experience"],["status","Status"]];
  const professionalFields = [["license_number","License Number"],["scfhs_classification","SCFHS Classification"],["hospital","Hospital"],["clinic","Clinic"],["working_hours","Working Hours"],["languages","Languages"],["joining_date","Joining Date"],["contract_type","Contract Type"]];
  const educationFields = [["saudi_board","Saudi Board"],["international_board","International Board"],["bachelor","Bachelor Degree"],["master","Master Degree"],["fellowship","Fellowship"],["subspecialty","Subspecialty"],["courses","Courses"],["bls_acls","BLS / ACLS / PALS"],["cme_hours","CME Hours"],["research","Research & Publications"]];
  const clinicalFields = [["patients_per_day","Patients Per Day"],["emergency_cases","Emergency Cases"],["clinical_performance","Clinical Performance"],["on_call","On-Call Duties"]];
  const adminFields = [["approval_status","Approval Status"],["shift_type","Shift Type"],["availability","Availability"]];
  const evalFields = [["eval_year1","Year 1"],["eval_year2","Year 2"],["eval_year3","Year 3"],["eval_year4","Year 4"],["eval_year5","Year 5"],["eval_avg","Average Score"],["eval_status","Status"]];

  function FieldsGrid({ fields }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {fields.map(([key, label]) => <Field key={key} label={label} value={doctor[key]} editable={false} onChange={() => {}} />)}
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Avatar name={doctor.full_name} size={80} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px" }}>{doctor.full_name || "—"}</h2>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 12px" }}>{doctor.job_title || "—"}</p>
            <div style={{ display: "flex", gap: 24 }}>
              {[["ID", doctor.doctor_id], ["Nationality", doctor.nationality], ["Experience", doctor.years_experience]].map(([l, v]) => (
                <div key={l}><p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 3px" }}>{l}</p><p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{v || "—"}</p></div>
              ))}
              <div><p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 3px" }}>Status</p><Badge>{doctor.status}</Badge></div>
            </div>
          </div>
          {isAdmin && <button onClick={onEdit} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: TEAL, color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}><i className="ti ti-pencil" style={{ fontSize: 15 }} /> تعديل</button>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {sectionTabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveSection(tab.key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: activeSection === tab.key ? `1.5px solid ${TEAL}` : "0.5px solid var(--color-border-tertiary)", background: activeSection === tab.key ? TEAL_LIGHT : "var(--color-background-primary)", color: activeSection === tab.key ? TEAL : "var(--color-text-secondary)", cursor: "pointer", fontSize: 12, fontWeight: activeSection === tab.key ? 500 : 400 }}>
            <i className={`ti ${tab.icon}`} style={{ fontSize: 14 }} />
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 20 }}>
        {activeSection === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {overviewCards.map(card => (
              <button key={card.key} onClick={() => setActiveSection(card.key)} style={{ textAlign: "left", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16, cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: TEAL_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <i className={`ti ${card.icon}`} style={{ fontSize: 18, color: TEAL }} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 4px" }}>{card.label}</p>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>{card.desc}</p>
              </button>
            ))}
          </div>
        )}
        {activeSection === "personal" && <FieldsGrid fields={personalFields} />}
        {activeSection === "professional" && <FieldsGrid fields={professionalFields} />}
        {activeSection === "education" && <FieldsGrid fields={educationFields} />}
        {activeSection === "clinical" && <FieldsGrid fields={clinicalFields} />}
        {activeSection === "administrative" && <FieldsGrid fields={adminFields} />}
        {activeSection === "evaluation" && <FieldsGrid fields={evalFields} />}
      </div>
    </div>
  );
}

// MAIN APP
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (user) fetchDoctors();
  }, [user]);

  async function fetchDoctors() {
    const { data } = await supabase.from("doctors").select("*").order("created_at");
    if (data) {
      setDoctors(data);
      if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
      if (!isAdmin && data.length > 0) {
        const mine = data.find(d => d.user_id === user.id);
        if (mine) setSelectedId(mine.id);
      }
    }
  }

  async function saveDoctor(form) {
    setSaving(true);
    if (editDoctor) {
      await supabase.from("doctors").update(form).eq("id", editDoctor.id);
    } else {
      await supabase.from("doctors").insert({ ...form, user_id: user.id });
    }
    await fetchDoctors();
    setShowForm(false);
    setEditDoctor(null);
    setSaving(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  const filtered = useMemo(() => doctors.filter(d =>
    `${d.full_name} ${d.specialty} ${d.department}`.toLowerCase().includes(query.toLowerCase())
  ), [doctors, query]);

  const selected = doctors.find(d => d.id === selectedId);

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontSize: 16, color: TEAL }}>جاري التحميل...</div>;
  if (!user) return <LoginPage onLogin={u => setUser(u)} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)" }}>
      <aside style={{ width: 200, background: "var(--color-background-primary)", borderRight: "0.5px solid var(--color-border-tertiary)", padding: "20px 12px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: TEAL_LIGHT, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-building-hospital" style={{ fontSize: 20, color: TEAL }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: TEAL }}>Doctor Profile</p>
            <p style={{ fontSize: 10, color: "var(--color-text-secondary)", margin: 0 }}>{isAdmin ? "Admin" : "Doctor"}</p>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px", marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
          <p style={{ fontSize: 12, fontWeight: 500, margin: 0, color: isAdmin ? TEAL : "var(--color-text-primary)" }}>{isAdmin ? "Admin" : "Doctor"}</p>
        </div>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer", fontSize: 13 }}>
          <i className="ti ti-logout" style={{ fontSize: 17 }} /> تسجيل خروج
        </button>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Doctor Dashboard</h1>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>Manage and view doctor information</p>
          </div>
          {isAdmin && (
            <div style={{ position: "relative" }}>
              <i className="ti ti-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "var(--color-text-secondary)" }} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search doctor..." style={{ paddingLeft: 34, width: 260, fontSize: 13 }} />
            </div>
          )}
        </header>

        <div style={{ display: "flex", flex: 1 }}>
          {isAdmin && (
            <aside style={{ width: 260, background: "var(--color-background-primary)", borderRight: "0.5px solid var(--color-border-tertiary)", padding: 16, overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>الأطباء ({doctors.length})</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {filtered.map(doc => (
                  <button key={doc.id} onClick={() => { setSelectedId(doc.id); setShowForm(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, border: selectedId === doc.id ? `1.5px solid ${TEAL}` : "0.5px solid var(--color-border-tertiary)", background: selectedId === doc.id ? TEAL_LIGHT : "var(--color-background-primary)", cursor: "pointer", textAlign: "left" }}>
                    <Avatar name={doc.full_name} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.full_name || "—"}</p>
                      <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "2px 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.specialty || "—"}</p>
                      <Badge>{doc.status}</Badge>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => { setShowForm(true); setEditDoctor(null); setSelectedId(null); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "10px 0", borderRadius: 10, background: TEAL, color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                <i className="ti ti-plus" style={{ fontSize: 16 }} /> إضافة طبيب جديد
              </button>
            </aside>
          )}

          <main style={{ flex: 1, padding: 20, overflowY: "auto" }}>
            {showForm ? (
              <DoctorForm doctor={editDoctor} onSave={saveDoctor} onCancel={() => { setShowForm(false); setEditDoctor(null); }} isAdmin={isAdmin} />
            ) : selected ? (
              <DoctorProfile doctor={selected} isAdmin={isAdmin} onEdit={() => { setEditDoctor(selected); setShowForm(true); }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, color: "var(--color-text-secondary)", fontSize: 14 }}>
                {isAdmin ? "اختر طبيب من القائمة أو أضف طبيب جديد" : "لا يوجد ملف مرتبط بحسابك، تواصل مع الأدمن"}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
