# Build Context: {client-name}

<build_meta>
client: {client-name}
started: {timestamp}
mode: {initial-build | modification | debug | optimization}
triggered_by: {command or user request description}
agents_involved: {list of agents that will/have participated}
</build_meta>

---

<decisions>
<!-- Each agent appends key decisions here with reasoning. Format: -->
<!-- [agent-name] Decision description. Reasoning: why this choice was made. -->
</decisions>

---

<discoveries>
<!-- Unexpected findings that may affect downstream agents or future work. Format: -->
<!-- [agent-name] What was discovered and why it matters. -->
</discoveries>

---

<cross_agent_requests>
<!-- Explicit requests from one agent to another. Format: -->
<!-- [source-agent → target-agent] What is requested and why. -->
</cross_agent_requests>

---

<open_questions>
<!-- Unresolved questions that may need user input or further investigation. Format: -->
<!-- [agent-name] Question and what information would help resolve it. -->
</open_questions>

---

<warnings>
<!-- Risks, concerns, or potential issues flagged by any agent. Format: -->
<!-- [agent-name] What the risk is and what might mitigate it. -->
</warnings>
