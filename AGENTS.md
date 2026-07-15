# tanishsidhu.github.io Context Adapter

Global preferences are loaded through the assistant's global configuration. Do not duplicate them here.

## Local project context

Before significant work, read:

- `/Users/tanishpreetsidhu/Documents/Obsidian/Context/Projects/tanishsidhu.github.io/PROJECT.md`
- `/Users/tanishpreetsidhu/Documents/Obsidian/Context/Projects/tanishsidhu.github.io/ARCHITECTURE.md`
- `/Users/tanishpreetsidhu/Documents/Obsidian/Context/Projects/tanishsidhu.github.io/CURRENT_STATE.md`
- `/Users/tanishpreetsidhu/Documents/Obsidian/Context/Projects/tanishsidhu.github.io/DECISIONS.md`
- `/Users/tanishpreetsidhu/Documents/Obsidian/Context/Projects/tanishsidhu.github.io/HANDOFF.md`

Only these project files and the canonical global preferences are in scope. Do not inspect unrelated vault notes.

## Context maintenance

For substantial project work, complete the context handoff before ending the task: update `CURRENT_STATE.md` with completed work, blockers, next steps, verification, and the verified Git commit; append meaningful decisions to `DECISIONS.md`; update `ARCHITECTURE.md` for design changes; update `PROJECT.md` only for scope or behavior changes; and update `HANDOFF.md` with the safest next action. Name the context files updated in the final report. If they cannot be updated, explain why and do not claim that the handoff is current. Never rewrite historical decisions silently.

## Remote fallback

The local vault path may not exist for cloud or container agents. If `docs/agent-context/` exists, use it. Otherwise ask for project context rather than searching personal notes or guessing.
