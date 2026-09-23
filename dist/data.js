window.REVERB_DATA = {
  meetings: [
    {
      id: "q4-council", title: "Q4 product council: Enterprise readiness", date: "2026-09-21T14:00:00", duration: 3588, platform: "Microsoft Teams", type: "Product", summary: "The council aligned on a narrow enterprise-readiness plan: SSO and audit exports lead, regional hosting follows, and the public API stays in controlled beta.",
      participants: [
        ["Maya Chen","MC","#6269c5"],["Omar Haddad","OH","#168266"],["Priya Shah","PS","#b85d7a"],["Jordan Lee","JL","#b4692b"],
        ["Nina Park","NP","#287c9b"],["Gabriel Costa","GC","#6b55a3"],["Ava Brooks","AB","#a84646"],["Ben Foster","BF","#477b64"]
      ],
      topics: [[0,"Context"],[412,"SSO"],[938,"Audit logs"],[1534,"Data residency"],[2210,"API beta"],[2968,"Launch plan"]],
      transcript: [
        [0,72,"Maya Chen","Thanks, everyone. The goal today is to leave with a defensible enterprise-readiness sequence, not a list of everything customers have ever requested."],
        [72,166,"Omar Haddad","Across the last twelve enterprise calls, SSO was a hard gate in nine. Audit evidence was second, and data residency came up mostly in regulated European accounts."],
        [166,286,"Priya Shah","Support sees the same pattern. Admins can tolerate manual provisioning during a pilot, but security review stops completely when we cannot describe access controls and event history."],
        [286,412,"Jordan Lee","The design risk is scattering enterprise controls across the product. I propose one admin center with identity, members, security events, and data controls."],
        [412,540,"Nina Park","For SSO, the backend is close. We can support SAML for the launch cohort if we keep just-in-time provisioning and group mapping out of the first release."],
        [540,678,"Gabriel Costa","Sales can work with that. Acme and Northstar both said basic SAML plus enforced login is enough to enter procurement. Group mapping is valuable, not gating."],
        [678,816,"Ava Brooks","We should be exact in the launch language. SAML SSO, domain verification, and an enforcement toggle. Anything beyond that needs to say planned."],
        [816,938,"Ben Foster","I will own the implementation checklist and threat-model review. We need failure states for expired certificates and misconfigured metadata, not just the happy path."],
        [938,1072,"Maya Chen","Decision one: SSO is the top launch requirement. Nina and Ben will scope the hardened path; Jordan will keep it inside a coherent admin center."],
        [1072,1208,"Priya Shah","On audit logs, support needs human-readable events. Customers ask who changed sharing, who exported a transcript, and when a member was removed."],
        [1208,1352,"Nina Park","We already emit most of those events internally. A downloadable CSV is much cheaper than a polished streaming API and covers the immediate review workflow."],
        [1352,1534,"Omar Haddad","The evidence supports that tradeoff. Security teams want a file they can attach to the review now. SIEM ingestion appears after the deal is live."],
        [1534,1680,"Maya Chen","Decision two: searchable audit events and CSV export ship; streaming export does not. Priya, please validate the event vocabulary with three admins."],
        [1680,1818,"Ava Brooks","For data residency, we must not imply that selecting a region moves historical recordings. The first version should apply only to new data."],
        [1818,1960,"Ben Foster","A new-data boundary also makes the migration risk manageable. We can document retention and deletion clearly while the backfill plan remains separate."],
        [1960,2098,"Gabriel Costa","Would lack of migration block Northstar? They asked for EU hosting but their pilot has no existing calls, so it should not."],
        [2098,2210,"Omar Haddad","Correct. For expansion customers it matters later. For new enterprise pilots, regional placement at workspace creation is enough."],
        [2210,2352,"Maya Chen","Decision three: EU residency is a second milestone and only applies at workspace creation. We will not bundle migration into the launch promise."],
        [2352,2472,"Nina Park","The API beta has six active design partners. Reliability is good, but permissions are too broad and the rate-limit story is not ready for public self-service."],
        [2472,2608,"Gabriel Costa","Keeping it controlled is fine if sales has a qualification checklist and a predictable approval window. Uncertainty is harder to sell than a limited beta."],
        [2608,2724,"Jordan Lee","The developer page should show scopes and sample responses even if keys are issued manually. That will make the beta feel intentional."],
        [2724,2840,"Ben Foster","I want a security review on each integration until scoped tokens land. A leaked beta key currently reaches more transcript content than it should."],
        [2840,2968,"Maya Chen","Decision four: the API remains a controlled beta. Ben reviews access, Gabriel owns qualification, and Jordan publishes a transparent capability page."],
        [2968,3094,"Ava Brooks","For launch, I can build the narrative around control and evidence: control identity, prove what happened, choose where new data lives."],
        [3094,3210,"Omar Haddad","That ordering matches the research. It also gives us measurable gates: security review completion, pilot activation, and time to first approved recording."],
        [3210,3330,"Priya Shah","I will create the admin validation group this week and test the audit vocabulary before engineering freezes the schema."],
        [3330,3442,"Nina Park","Engineering can deliver SSO hardening in three weeks and audit export one week later, assuming the admin screens are ready in parallel."],
        [3442,3520,"Jordan Lee","I will have the full admin-center prototype ready for review Friday, including empty, loading, and configuration-error states."],
        [3520,3588,"Maya Chen","Great. We have four decisions, clear owners, and a launch sequence. I will post the decision memo today and we will review risk next Tuesday."]
      ],
      actions: [
        ["a1","Harden the SAML path and document failure states","Nina Park","Sep 30",412],
        ["a2","Complete SSO threat-model review","Ben Foster","Sep 30",816],
        ["a3","Validate audit-event vocabulary with three admins","Priya Shah","Sep 28",1534],
        ["a4","Prototype the unified admin center","Jordan Lee","Sep 25",286],
        ["a5","Write the enterprise launch narrative","Ava Brooks","Oct 02",2968],
        ["a6","Create API beta qualification checklist","Gabriel Costa","Sep 29",2472],
        ["a7","Publish enterprise decision memo","Maya Chen","Sep 23",3520]
      ],
      decisions: [
        ["SAML SSO is the top launch requirement; JIT provisioning and group mapping wait.",938],
        ["Ship searchable audit events and CSV export, not streaming export.",1534],
        ["EU residency follows SSO and applies to new workspaces only.",2210],
        ["Keep the public API in a controlled, security-reviewed beta.",2840]
      ],
      highlights: [
        ["h1","The actual enterprise gate","SSO was a hard gate in nine of twelve enterprise calls.",72,166],
        ["h2","A pragmatic audit-log wedge","A downloadable CSV covers the immediate security review workflow.",1208,1352],
        ["h3","The residency boundary","Regional placement applies at workspace creation; migration stays separate.",2098,2352],
        ["h4","Why the API remains controlled","Permissions are broad and scoped tokens are not ready.",2352,2840],
        ["h5","The launch narrative","Control identity, prove what happened, choose where new data lives.",2968,3094]
      ]
    },
    {
      id: "acme-review", title: "Acme onboarding workflow review", date: "2026-09-22T10:30:00", duration: 1902, platform: "Zoom", type: "Customer", summary: "Acme's pilot is healthy, but workspace setup and CSV imports create avoidable friction. The team agreed on a guided import and weekly adoption review.",
      participants: [["Jordan Lee","JL","#6269c5"],["Samira Khan","SK","#168266"],["Elena Rossi","ER","#b85d7a"],["Tom Walker","TW","#b4692b"]],
      topics: [[0,"Pilot health"],[320,"Import friction"],[690,"Permissions"],[1040,"Adoption"],[1450,"Next steps"]],
      transcript: [
        [0,98,"Jordan Lee","Today I want to understand where the onboarding flow breaks and agree on the smallest changes that make your broader rollout safe."],
        [98,205,"Samira Khan","The pilot group is using summaries daily. The value is clear; the friction is almost entirely before the first useful meeting appears."],
        [205,320,"Elena Rossi","Calendar connection worked, but workspace roles were confusing. Two managers thought they needed admin access just to invite their teams."],
        [320,438,"Tom Walker","Our CSV imported, but twelve people failed because the department column used names your template did not recognize."],
        [438,568,"Jordan Lee","That should have been a recoverable mapping step, not a rejected import. We can show unmatched values and let an admin map them before submitting."],
        [568,690,"Samira Khan","A preview would help. Right now success and failure arrive after the upload, so we repeat the entire process for one formatting issue."],
        [690,824,"Elena Rossi","Can team leads manage folders without seeing private calls? That is the main permissions question from our security group."],
        [824,942,"Jordan Lee","Yes, but the current role labels do not explain that well. We will separate content visibility from workspace-management permissions in the copy."],
        [942,1040,"Tom Walker","That distinction needs to be in the invite flow too. People make the role choice before they ever reach settings."],
        [1040,1164,"Samira Khan","Adoption is strongest in customer success and weakest in product. Product joins irregularly because meetings are not consistently on the connected calendar."],
        [1164,1290,"Jordan Lee","We can add a weekly coverage view: eligible meetings, recorded meetings, and the reason each miss occurred."],
        [1290,1408,"Elena Rossi","That would make our enablement conversations concrete. Please avoid a single adoption percentage without the underlying missed-meeting reasons."],
        [1408,1518,"Tom Walker","We can nominate one lead per department to review the coverage report and fix calendar hygiene locally."],
        [1518,1638,"Jordan Lee","I will deliver the import mapping prototype Thursday and revise the permissions language. Samira, can you identify the departmental leads?"],
        [1638,1762,"Samira Khan","Yes, by Friday. We will run the next onboarding cohort Monday and measure time from invite to first recorded meeting."],
        [1762,1902,"Elena Rossi","That gives security what it needs. Let us reconvene after the cohort with the failed-import count, role questions, and meeting coverage."]
      ],
      actions: [["b1","Prototype recoverable CSV column mapping","Jordan Lee","Sep 24",438],["b2","Revise role language in settings and invite flow","Jordan Lee","Sep 25",824],["b3","Nominate one adoption lead per department","Samira Khan","Sep 25",1518],["b4","Measure invite-to-first-meeting time for next cohort","Elena Rossi","Sep 29",1638]],
      decisions: [["Add a preview-and-map step instead of rejecting imperfect CSV imports.",438],["Separate content visibility from workspace-management language.",824],["Review adoption using meeting coverage and miss reasons, not one percentage.",1290]],
      highlights: [["b-h1","Where value starts","The friction is almost entirely before the first useful meeting appears.",98,205],["b-h2","Make imports recoverable","Show unmatched values and map them before submitting.",438,568],["b-h3","A better adoption metric","Show eligible meetings, recordings, and why each miss occurred.",1164,1408]]
    },
    {
      id: "launch-copy", title: "Quick launch copy check-in", date: "2026-09-23T09:15:00", duration: 126, platform: "Google Meet", type: "Internal", summary: "The team approved the shorter hero, clarified the simulation label, and assigned the final accessibility pass before publishing.",
      participants: [["Maya Chen","MC","#6269c5"],["Leo Martins","LM","#168266"],["Priya Shah","PS","#b85d7a"]],
      topics: [[0,"Hero copy"],[48,"Demo label"],[88,"Ship check"]],
      transcript: [[0,18,"Maya Chen","Two quick decisions: the hero line and how visibly we label the simulated recording."],[18,36,"Leo Martins","The shorter line wins: every meeting becomes a decision you can verify."],[36,51,"Priya Shah","Agreed. It says what is different without another paragraph of AI language."],[51,69,"Maya Chen","For the recording, use a persistent simulated demo badge, not a disclaimer hidden in settings."],[69,88,"Leo Martins","I will add it to the player and onboarding, and keep the public clip focused on the shared content."],[88,105,"Priya Shah","I will do the keyboard and contrast pass once that lands."],[105,126,"Maya Chen","Perfect. Ship after Priya signs off and keep the original headline in the notes."],
      ],
      actions: [["c1","Add persistent simulated-demo labels","Leo Martins","Sep 23",51],["c2","Complete keyboard and contrast review","Priya Shah","Sep 23",88]],
      decisions: [["Use the shorter hero: every meeting becomes a decision you can verify.",18],["Label simulated capture persistently in onboarding and the player.",51]],
      highlights: [["c-h1","Approved hero","Every meeting becomes a decision you can verify.",18,36],["c-h2","Transparent demo behavior","Use a persistent simulated demo badge.",51,69]]
    }
  ]
};
