# BIPE website — data retention policy

**Status:** proposed 4 Sep 2026, aligned to the trust's existing DPDP standard.
**Owner decision required on:** the public statement (see §5) and who implements enforcement (§4).

## 1. Why this exists

Website form submissions — apply, contact, enquiry, visit, and (since 4 Sep 2026)
alumni introduction requests — are stored in the BIPE Django backend at
`ec2-13-235-25-165` and hold personal data: name, phone, e-mail, branch of interest,
free-text message, and for alumni requests the visitor's stated purpose.

**Nothing currently expires any of it.** The trust's DPDP retention machinery
(`dpdp.data_retention_policies` + the daily Celery jobs in `tasks/retention.py`) lives
in the **Sampark CRM on a different server** and does not reach the BIPE website
backend. So these rows accumulate indefinitely today. That is the gap this policy closes.

## 2. Align, don't invent

The trust already adopted retention durations in the CRM
(`dpdp/migrations/0002_seed_retention_policies.py`). The dominant standard for
lead-type personal data is **540 days (18 months), then anonymise**, cited to DPDP §8:

| Existing CRM policy | Days | Action |
|---|---|---|
| lost_inquiry | 540 | anonymise |
| rejected_applicant | 540 | anonymise |
| bot_conversation | 540 | anonymise |
| voice_transcript | 540 | delete |
| voice_recording | 30 | delete |

The website's submissions are the same class of data as `lost_inquiry`, so they should
carry the same number. Using a different duration for the same kind of data on a sibling
system is the sort of inconsistency a DPDP review would pick up first.

## 3. Proposed policy

| Data | Retain | Then | Basis |
|---|---|---|---|
| Enquiry / contact / visit submissions | 540 days from last activity | anonymise (keep the row, clear name, phone, e-mail, free text) | matches `lost_inquiry`; preserves counts for reporting |
| Apply submissions that became admissions | keep | — | AICTE / BTEUP / academic-record statutes; already an exception on /privacy |
| Apply submissions that did not | 540 days | anonymise | matches `rejected_applicant` |
| **Alumni introduction requests** | **540 days** | **anonymise** | same class as `lost_inquiry`; the alumnus reference can stay, the visitor's identity goes |
| Server logs containing form payloads | 30 days | delete | matches `voice_recording`'s short-lived-operational-data logic |

**Anonymise, not delete**, for everything except logs — it satisfies erasure while keeping
the row so placement and admissions counts stay honest. That is the choice the CRM already
made for the same data class.

## 4. What enforcement requires — NOT done, needs the backend repo

The BIPE Django backend repo is not on the machine this policy was written on, so none of
this is implemented. Whoever holds it needs to:

1. Add a retention table (or hardcode the durations if a table is overkill for five rules).
2. Add a daily job mirroring `tasks/retention.py`: scan rows past
   `now() - retention_days`, apply delete/anonymise per row in a transaction, and write an
   audit row per affected record. Wrap each row in try/except so one bad row does not kill
   the batch — that pattern is already proven in the CRM.
3. Anonymisation should null name/phone/email/message and stamp `anonymised_at`, not drop
   the row.
4. Expose a manual erasure path so a data-subject request can be honoured before 540 days.

Until that ships, **the policy below is intent, not enforced behaviour** — which is exactly
why §5 matters.

## 5. The public statement — owner decision

`app/privacy/page.tsx` today claims DPDP alignment and names an erasure right "subject to
retention requirements", but **states no duration**. Adding "we retain for 18 months" while
nothing actually expires the data would be a public commitment the systems cannot honour —
the same shape of exposure as publishing an unapproved seat intake.

Two defensible options:

- **State it once enforcement ships.** Safest. Silence today is not a violation; a false
  promise is.
- **State it now as policy, worded as policy.** e.g. "Our retention policy is 18 months for
  enquiry data, after which records are anonymised." Honest about intent, and creates the
  pressure to implement.

Recommend the first unless the backend work is already scheduled.

## 6. Also open

Alumni introduction requests carry a **minor's** phone in many cases — BIPE markets to
10th-pass students, typically 15–16, as `/privacy` itself notes. That argues for the shorter
end of any range, and for the anonymise-not-keep default above.
