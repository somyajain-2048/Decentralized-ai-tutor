// src/ai_tutor_backend/src/lib.rs

use candid::{CandidType, Deserialize};
use serde::Serialize;

use std::cell::RefCell;

// Use fully-qualified attributes so we don't need ic_cdk_macros import.
use ic_cdk::storage::{stable_restore, stable_save};

/// -----------------------------
/// Data types
/// -----------------------------

#[derive(Clone, Debug, Default, CandidType, Deserialize, Serialize)]
pub struct UserProfile {
    pub name: String,
    pub learning_history: Vec<String>,
}

#[derive(Clone, Debug, Default, CandidType, Deserialize, Serialize)]
pub struct ResumeAnalysis {
    pub score: u32, // 0–100
    pub keywords_found: Vec<String>,
    pub suggestions: Vec<String>,
}

thread_local! {
    /// Simple in-canister state. We persist across upgrades via stable_save/restore.
    static STATE: RefCell<Option<UserProfile>> = RefCell::new(None);
}

/// -----------------------------
/// Upgrade hooks (persist STATE)
/// -----------------------------

#[ic_cdk::pre_upgrade]
fn pre_upgrade() {
    let data: Option<UserProfile> = STATE.with(|s| s.borrow().clone());
    stable_save((data,)).expect("failed to save stable state");
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    if let Ok((data,)) = stable_restore::<(Option<UserProfile>,)>() {
        STATE.with(|s| *s.borrow_mut() = data);
    }
}

/// -----------------------------
/// Profile & History
/// -----------------------------

/// Create or overwrite the profile (resets history).
#[ic_cdk::update]
pub fn set_profile(name: String) {
    let profile = UserProfile {
        name,
        learning_history: Vec::new(),
    };
    STATE.with(|s| *s.borrow_mut() = Some(profile));
}

/// Append an entry to the user's learning history.
#[ic_cdk::update]
pub fn add_history(entry: String) {
    STATE.with(|s| {
        if let Some(ref mut user) = *s.borrow_mut() {
            user.learning_history.push(entry);
        }
    });
}

/// Read the current profile (if any).
#[ic_cdk::query]
pub fn get_profile() -> Option<UserProfile> {
    STATE.with(|s| s.borrow().clone())
}

/// Convenience: return the learning history (empty if no profile yet).
#[ic_cdk::query]
pub fn get_history() -> Vec<String> {
    STATE.with(|s| {
        s.borrow()
            .as_ref()
            .map(|u| u.learning_history.clone())
            .unwrap_or_default()
    })
}

/// -----------------------------
/// AI Coach (toy logic)
/// -----------------------------

/// Tiny rule-based “coach” that returns tips based on prompt keywords.
/// (Replace with real LLM calls later.)
#[ic_cdk::query]
pub fn coach(prompt: String) -> String {
    let p = prompt.to_lowercase();

    if p.contains("rust") {
        return concat!(
            "Rust coach tips:\n",
            "• Practice ownership/borrowing with small examples.\n",
            "• Implement a small CLI with Result/Option and error handling.\n",
            "• Read the Rust Book ch. 4–10 and solve 2 exercises/day."
        )
        .to_string();
    }
    if p.contains("react") {
        return concat!(
            "React coach tips:\n",
            "• Build a small app with useState/useEffect and React Router.\n",
            "• Add TypeScript types to your components and props.\n",
            "• Practice lifting state and memoization (useMemo/useCallback)."
        )
        .to_string();
    }
    if p.contains("datastructures") || p.contains("data structures") {
        return concat!(
            "DSA tips:\n",
            "• Master arrays, maps, sets, and basic graphs first.\n",
            "• Do 1 easy + 1 medium problem daily for 3 weeks.\n",
            "• Learn time/space trade-offs and write out complexities."
        )
        .to_string();
    }

    format!(
        "Coach:\n• Define a clear goal for the next 7 days.\n• Study 60–90 mins daily, then summarize what you learned.\n• End each session by writing 1–2 questions for tomorrow.\n\nYour prompt: {}",
        prompt
    )
}

/// -----------------------------
/// Resume Analyzer (toy scoring)
/// -----------------------------

/// Simple keyword-based scoring with suggestions.
#[ic_cdk::query]
pub fn analyze_resume(resume_text: String) -> ResumeAnalysis {
    let text = resume_text.to_lowercase();

    let keywords = vec![
        "rust", "react", "typescript", "javascript", "node", "icp",
        "internet computer", "dfx", "aws", "gcp", "docker",
        "kubernetes", "graphql", "sql", "nosql", "redis",
        "testing", "unit test", "integration test",
        "ci", "cd", "devops", "microservices",
    ];

    let mut found: Vec<String> = Vec::new();
    for k in &keywords {
        if text.contains(k) {
            found.push(k.to_string());
        }
    }

    let mut score: i32 = (found.len() as i32) * 5; // up to ~100
    if text.contains("achievement") || text.contains("impact") || text.contains('%') {
        score += 10;
    }
    if text.contains("project") || text.contains("built") || text.contains("implemented") {
        score += 10;
    }
    let score = score.clamp(0, 100) as u32;

    let mut suggestions: Vec<String> = Vec::new();
    if !text.contains("impact") && !text.contains('%') {
        suggestions.push("Add quantified impact (e.g., improved X by 23%).".into());
    }
    if !text.contains("testing") {
        suggestions.push("Mention testing practices (unit/integration).".into());
    }
    if !text.contains("deployment") && !text.contains("ci") && !text.contains("cd") {
        suggestions.push("Add deployment/CI-CD experience if applicable.".into());
    }
    if found.len() < 6 {
        suggestions.push("Include more relevant keywords from the job description.".into());
    }

    ResumeAnalysis {
        score,
        keywords_found: found,
        suggestions,
    }
}

/// -----------------------------
/// Career Roadmap (toy generator)
/// -----------------------------

#[ic_cdk::query]
pub fn generate_roadmap(target_role: String) -> Vec<String> {
    let role = target_role.to_lowercase();

    if role.contains("rust") || role.contains("backend") {
        return vec![
            "Week 1–2: Rust basics: ownership/borrowing, Result/Option, modules".into(),
            "Week 3–4: Build a small REST-like service with Axum or Actix".into(),
            "Week 5: Persistence layer: SQL/ORM or sled".into(),
            "Week 6: Auth, config, logging, tracing".into(),
            "Week 7: Containerize and deploy; add basic CI".into(),
        ];
    }

    if role.contains("react") || role.contains("frontend") {
        return vec![
            "Week 1–2: React + TS fundamentals, hooks, Router".into(),
            "Week 3: State mgmt patterns & forms; accessibility".into(),
            "Week 4: Testing (RTL/vitest); performance profiling".into(),
            "Week 5: Build a dashboard app; API integration".into(),
            "Week 6: Deploy (Vercel/Netlify) + CI".into(),
        ];
    }

    if role.contains("fullstack") {
        return vec![
            "Week 1–2: React + TS; simple backend (Node/Rust)".into(),
            "Week 3: REST/GraphQL patterns; auth & sessions".into(),
            "Week 4: Database design; migrations; ORM".into(),
            "Week 5: Build an end-to-end feature; testing".into(),
            "Week 6: Observability, Docker, CI/CD, deploy".into(),
        ];
    }

    // Generic fallback
    vec![
        "Week 1: Clarify role & gather job descriptions".into(),
        "Week 2: Fill knowledge gaps; follow a focused course".into(),
        "Week 3: Build a small portfolio project end-to-end".into(),
        "Week 4: Polish resume + LinkedIn; apply to 5–10 roles".into(),
    ]
}

/// -----------------------------
/// Candid export helper (v0.16+)
/// -----------------------------

#[ic_cdk::query(name = "__get_candid_interface_tmp_hack")]
fn __export_did() -> String {
    // modern path (not ic_cdk::export::candid)
    ic_cdk::api::candid::export_service!();
    export_service()
}
