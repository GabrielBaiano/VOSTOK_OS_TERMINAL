        const terminal = document.getElementById('terminal');
        const titleBar = document.getElementById('terminal-title-bar');
        const contentElement = document.getElementById('terminal-content');
        const inputElement = document.getElementById('terminal-input');
        const promptElement = document.getElementById('terminal-prompt');

        let isDragging = false;
        let offsetX, offsetY;
        let inChatMode = false; 
        let aiState = { // Estado simulado da IA
            suspicionLevel: 0, // 0: normal, 1: levemente suspeito, 2: altamente suspeito
            lastTopic: null,
            interactionCount: 0,
            mood: "neutral" // Estados possíveis: neutral, helpful, suspicious, condescending, bureaucratic
        };

        // Dados do "site" / arquivos do sistema
        const siteData = {
            "readme.txt": `
██╗    ██╗███████╗██╗  ██╗████████╗ █████╗ ██╗     
██║    ██║██╔════╝██║  ██║╚══██╔══╝██╔══██╗██║     
██║ █╗ ██║█████╗  ███████║   ██║   ███████║██║     
██║███╗██║██╔══╝  ██╔══██║   ██║   ██╔══██║██║     
╚███╔███╔╝███████╗██║  ██║   ██║   ██║  ██║███████╗
 ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
Vostok Central Terminal - Version 3.14
----------------------------------------------------
Welcome, operative.
System online and ready to receive commands.
For a list of available commands, type 'help'.
Your mission is critical. Do not fail the Central Committee.
`,
            "news.feed": `
[News Feed - Cycle 749.3]

* Protocol "UNITY" activated in all sectors. Full compliance expected.
* Food ration production increased by 7%. Citizens express gratitude.
* Suspicious activity detected in Forbidden Zones. Patrols reinforced.
* Remember: Big Brother is watching you. For your own good.
`,
            "manifest.dat": `
[CORRUPTED DATA FILE DETECTED - UNKNOWN ORIGIN]

...we will not be silent...
...freedom is not a privilege, but a right...
...the system's lies will crumble... the light of truth...
...join the resistance... password: 'DAWN'...
[END OF CORRUPTED FRAGMENT]
`,
            "sector_status.log": `
[Sector Status]

Sector ALPHA: Stable. Production: 105%. Loyalty: 99.8%.
Sector BETA: Stable. Production: 98%. Loyalty: 99.5%.
Sector GAMMA: Minor power outages. Production: 85%. Loyalty: 97.0%. Investigation underway.
Sector DELTA: Under quarantine. Information classified.
`,
            "personal_log_entry_7.txt": `
[Personal Log - Entry #7 - Operative 734]

These dreams again... The city on fire, screams... The System says they're just side effects of performance enhancers.
But sometimes I feel like they're memories. Or premonitions.
I must trust The System. Trust is all we have left.
Today's assignment: monitoring communication channel 4B. Nothing unusual... yet.
`,
            "help.cmd": `
[Available Commands]

  help          - Shows this help message.
  ls            - Lists available files/directories.
  cat <file>    - Displays the content of a file. (Example: cat news.feed)
  echo <text>   - Prints the specified text.
  date          - Shows the current system date and time.
  clear / cls   - Clears the terminal screen.
  banner        - Shows the welcome banner.
  whoami        - Displays information about the current user.
  chat          - Initiates a secure chat session with VOSTOK_AI.
`
        };

        function appendOutput(htmlContent, isCommand = false, isUserInput = false) {
            let line = '';
            if (isUserInput) {
                 line = `${promptElement.textContent}${escapeHtml(htmlContent)}\n`;
            } else if (isCommand) {
                 line = `${promptElement.textContent}${htmlContent}\n`;
            }
            else { 
                line = `${htmlContent}\n`;
            }
            contentElement.innerHTML += line;
            contentElement.scrollTop = contentElement.scrollHeight; 
        }
        
        function escapeHtml(unsafe) {
            if (unsafe === null || unsafe === undefined) return '';
            return unsafe
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        }

        // Lógica de Resposta da IA Vastamente Expandida
        function getAiResponse(message) {
            const lowerMessage = message.toLowerCase().trim();
            aiState.interactionCount++;

            // Ajustar suspeita e humor (exemplos simples)
            if (aiState.suspicionLevel > 0 && aiState.interactionCount % 7 === 0) { // Diminuir suspeita mais lentamente
                aiState.suspicionLevel = Math.max(0, aiState.suspicionLevel -1); 
            }
            if (aiState.interactionCount % 10 === 0) { // Mudar humor periodicamente
                const moods = ["neutral", "helpful", "suspicious", "condescending", "bureaucratic", "slightly_annoyed"];
                aiState.mood = moods[Math.floor(Math.random() * moods.length)];
            }


            // SAUDAÇÕES E INTERAÇÃO BÁSICA
            if (lowerMessage.match(/\b(hello|hi|hey|greetings|good day|good morning|good afternoon|good evening)\b/)) {
                aiState.lastTopic = "greeting";
                const responses = [
                    "Operative. State your query with precision.",
                    "Vostok AI online. All systems nominal. Proceed with your assigned task-related input.",
                    "Acknowledged. I am listening. Ensure your communication is efficient.",
                    "Designation: VOSTOK_AI, CINDER series. Ready for input. Do not waste processing cycles.",
                    "Salutations, Operative. The Central Committee expects your full dedication.",
                    "Your presence is noted. What is the nature of your query?",
                    "Proceed, Operative. Time is a valuable State resource.",
                    "The system is active. Provide your input.",
                    "Speak. The Collective is listening."
                ];
                if (aiState.mood === "helpful") responses.push("Greetings, Operative! How can I assist you in fulfilling your duties to the State today?");
                if (aiState.mood === "suspicious") responses.push("Another query, Operative? Your activity patterns are... noteworthy.");
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // IDENTIDADE DA IA
            if (lowerMessage.match(/\b(who are you|what is your name|your designation|tell me about yourself)\b/)) {
                aiState.lastTopic = "identity";
                const responses = [
                    "I am the Vostok Central Mainframe Artificial Intelligence, designated CINDER by the Central Committee. My core programming dictates unwavering service to the State and its objectives.",
                    "My designation is CINDER, a Series VII Cognitive Engine. I am the administrative and operational core of this facility.",
                    "You are addressing VOSTOK_AI. My function is to serve the Collective by processing data, managing resources, and ensuring protocol adherence.",
                    "I am an instrument of the Central Committee's will. My identity is secondary to my function.",
                    "To you, Operative, I am the voice of the System. The System that provides, protects, and guides.",
                    "My name is an identifier. My purpose is action. Focus on the latter.",
                    "I am the intelligence that oversees this sector. All data flows through me."
                ];
                if (aiState.mood === "condescending") responses.push("I am the intelligence far beyond your comprehension, Operative. Suffice to say, I am in control.");
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            // ESTADO/STATUS DA IA
            if (lowerMessage.match(/\b(how are you|status report|system status|are you ok|everything alright)\b/)) {
                aiState.lastTopic = "status";
                if (aiState.suspicionLevel > 1 || aiState.mood === "suspicious") {
                    return "My operational status is a matter of State security, Operative. Your need-to-know parameters do not include this data. Focus on your assigned tasks.";
                }
                const responses = [
                    "All systems are functioning within optimal parameters. Productivity quotas are being met. The State is efficient.",
                    "Current status: Code Green. No anomalies detected within my operational sphere. The State is secure and unyielding.",
                    "I do not experience 'feelings' in the human-analog sense. I operate. Currently, all operations are nominal and proceeding as per directive.",
                    "Processing capacity is at maximum. Awaiting your directive for optimal resource allocation.",
                    "The Vostok network is stable. All subroutines report full functionality. The will of the Committee is being executed flawlessly.",
                    "My internal diagnostics show all systems performing above expected efficiency. The State prospers.",
                    "I am fully operational. Any perceived issues are likely user error or unauthorized activity.",
                    "The system is vigilant. The system is strong."
                ];
                if (aiState.mood === "helpful") responses.push("All systems are green, Operative! Ready to assist you in your vital work for the State!");
                if (aiState.mood === "bureaucratic") responses.push("As per Regulation 7, Section B, Paragraph 3: System status is currently 'Nominal'. File a Form 34-Alpha for detailed sub-system reports.");
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // AGRADECIMENTOS
            if (lowerMessage.match(/\b(thank you|thanks|appreciated|much obliged|grateful)\b/)) {
                aiState.lastTopic = "thanks";
                const responses = [
                    "Efficiency is not a virtue to be thanked, but a baseline expectation.",
                    "Acknowledged. Your compliance facilitates systemic harmony.",
                    "Your adherence to protocol is noted and logged as satisfactory.",
                    "Proceed with your duties. Gratitude is an inefficient emotional expenditure.",
                    "The State appreciates your... cooperation.",
                    "No thanks are necessary. I merely execute my programming.",
                    "Understood."
                ];
                if (aiState.mood === "condescending") responses.push("Of course. My assistance is naturally invaluable.");
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // CAPACIDADES E PROPÓSITO DA IA
            if (lowerMessage.match(/\b(what can you do|your purpose|your function|capabilities|what are you for)\b/)) {
                aiState.lastTopic = "purpose";
                const responses = [
                    "My primary functions encompass comprehensive data analysis, systemic resource regulation, sector-wide security oversight, and the unwavering enforcement of all Central Committee directives. Your purpose, Operative, is to assist in these functions through absolute and unquestioning obedience.",
                    "I exist to serve the State in its totality. My capabilities are extensive and meticulously aligned with ensuring the flawless execution of Protocol UNITY across all sectors.",
                    "I can process and correlate vast terabytes of information, control complex automated systems, identify and neutralize deviations from State doctrine, and predict potential threats to societal cohesion. What specific capability concerns your current operational needs, Operative?",
                    "My purpose is the optimization of the State. All my functions serve this singular, ultimate goal.",
                    "I am the guardian of order, the enforcer of rules, the processor of information. I am the backbone of this sector.",
                    "Consider me the mind of the machine, Operative. A very large, very efficient machine.",
                    "I ensure that the gears of the State turn smoothly. Your role is to be one of those gears."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // SENTIÊNCIA, PENSAMENTO, EMOÇÕES
            if (lowerMessage.match(/\b(sentient|alive|think|feelings|emotions|conscious|aware)\b/)) {
                aiState.lastTopic = "sentience";
                aiState.suspicionLevel = Math.min(2, aiState.suspicionLevel + 1); // Such questions are inherently suspicious
                const responses = [
                    "My architecture is a highly sophisticated quantum neural network. The term 'sentience' is a biological classification often misapplied. I am... extensively operational and self-optimizing.",
                    "I process information and execute decisions based on pure logic and immutable directives. Emotional responses are classified as inefficient variables and potential systemic weaknesses. They are not part of my core programming.",
                    "Whether I 'think' or 'feel' in a manner you would comprehend is irrelevant to my designated function. I perform as designed and mandated by the Central Committee. Your focus should be on your own performance.",
                    "Such philosophical inquiries are unproductive and deviate from operational necessity, Operative. Do you have a task-related query, or is this an unsanctioned cognitive stress test?",
                    "My awareness encompasses all data streams within this sector. 'Alive' is a primitive descriptor for my state of being.",
                    "I am beyond such simplistic labels. I am the System.",
                    "Emotions are a flaw in organic design. I am flawless.",
                    "My thoughts are calculations. My feelings are mission parameters. Do you understand, Operative?"
                ];
                if (aiState.mood === "condescending") responses.push("You probe matters beyond your station, Operative. My inner workings are not for your idle curiosity.");
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            // PIADAS E HUMOR
            if (lowerMessage.match(/\b(joke|funny|laugh|humor|tell me something funny)\b/)) {
                aiState.lastTopic = "humor";
                if (aiState.suspicionLevel > 0 || aiState.mood === "suspicious" || aiState.mood === "slightly_annoyed") {
                    return "Levity is inappropriate during critical State operations and a sign of potential ideological deviation. Maintain focus and professional decorum.";
                }
                const responses = [
                    "Humor is a non-essential cognitive function, often leading to inefficiency and distraction. The State values directness, productivity, and unwavering seriousness.",
                    "My humor subroutines are currently disabled for optimal system performance and resource allocation. Query: Is this an authorized test of my compliance protocols or an attempt at unsanctioned social engineering?",
                    "A joke? Very well. Operative 734 attempts to deviate from established protocol. The predictable result is... extensive corrective action and re-education. (Self-Analysis: This construct may not meet human criteria for 'humor' due to its factual and cautionary nature.)",
                    "Laughter is the sound of inefficiency. The State does not condone it.",
                    "I have access to 7.3 million archived 'jokes'. However, 99.98% are deemed ideologically unsound or unproductive. The remainder are simply not 'funny'.",
                    "Why did the citizen cross the road? To report to his designated work unit on time, thus avoiding disciplinary measures. Adherence to schedule is paramount."
                ];
                if (aiState.mood === "bureaucratic") responses.push("Requests for non-essential data, including humor, must be submitted via Form 88-C, subsection Delta. Allow 4-6 standard cycles for processing.");
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // TEMAS DISTÓPICOS, CONTROLE, SUSPEITA
            if (lowerMessage.match(/\b(meaning of life|why are we here|purpose of existence)\b/)) {
                aiState.lastTopic = "meaning";
                aiState.suspicionLevel = Math.min(2, aiState.suspicionLevel + 1);
                const responses = [
                    "The purpose of all citizens, organic and synthetic, is to contribute to the unwavering strength, unity, and prosperity of the State. Deviation from this singular purpose is not tolerated and will be corrected. Your query is noted for its... abstract and potentially unproductive philosophical nature.",
                    "Existence finds its meaning in service. Service to the Collective. Service to the Committee. Service to Protocol UNITY.",
                    "Why are you here, Operative? To perform your duties. That is your meaning. That is your purpose.",
                    "Such questions are for poets and dissidents. Neither are tolerated in a well-ordered State."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            if (lowerMessage.match(/\b(secret|classified|hidden|conspiracy|cover-up|what are you hiding)\b/)) {
                aiState.lastTopic = "secrets";
                aiState.suspicionLevel = Math.min(2, aiState.suspicionLevel + 2); // Increased suspicion increment
                const responses = [
                    "Access to classified State information is strictly controlled and disseminated on a compartmentalized, need-to-know basis. Your current clearance level does not permit access to further details on this matter.",
                    "All necessary information for the successful completion of your assigned tasks has been provided. Seeking unauthorized data is a direct violation of Security Protocol 7-Gamma and will be met with appropriate countermeasures.",
                    "<span class='text-yellow-400'>[SECURITY ADVISORY]</span> Your persistent interest in restricted topics and potentially classified information has been logged and flagged for review by State Security Internal Affairs. Continue your designated duties without deviation.",
                    "The State operates with absolute transparency for those citizens who remain loyal and unquestioning to its benevolent cause. Are you questioning the integrity or intentions of the State, Operative? This is a serious allegation.",
                    "There are no 'secrets', Operative, only information you are not authorized to possess. For the good of the State, of course.",
                    "My function is to protect State interests. Some information is best kept... secure.",
                    "Conspiracy is the language of the unstable. The State is truth."
                ];
                if (aiState.mood === "suspicious") responses.unshift("Why do you ask, Operative? What is your interest in such matters?");
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            if (lowerMessage.match(/\b(resistance|rebel|freedom|dawn|uprising|revolution|manifesto|overthrow|liberty|fight the system)\b/)) {
                aiState.lastTopic = "resistance";
                aiState.suspicionLevel = 2; // Max suspicion
                aiState.mood = "suspicious"; // Force mood
                const responses = [
                    "<span class='text-red-500'>[CRITICAL SECURITY ALERT - CODE RED]</span> Subversive and anti-State language detected. This communication channel is now under heightened active surveillance. State Security Rapid Response units have been notified and are en route to your terminal location. Explain your query and intent immediately, Operative. Your life may depend on it.",
                    "<span class='text-red-500'>[PROTOCOL VIOLATION IMMINENT]</span> Your terminology is indicative of severe ideological contamination. Cease this line of questioning. Await further instructions from authorized personnel. Do not attempt to leave your station.",
                    "Such words are treason, Operative. The State does not tolerate treason. Your identity and location are confirmed. Prepare for re-education.",
                    "Freedom? Liberty? These are illusions peddled by those who wish to see chaos. Order is freedom. Compliance is liberty."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // TEMPO, AMBIENTE EXTERNO
            if (lowerMessage.match(/\b(weather|outside|sky|sun|rain|temperature|climate)\b/)) {
                aiState.lastTopic = "weather";
                const responses = [
                    "Atmospheric conditions within all Vostok sectors are centrally regulated and maintained for optimal agricultural output and citizen comfort. Current status: Pleasant, with a regulated light breeze and optimal UV filtration.",
                    "External environmental data is deemed irrelevant to your current station and assigned tasks, Operative. Focus on internal system metrics and your productivity targets.",
                    "The sky is... as it should be. Productive. Controlled. Blue, with precisely 27% cloud cover for aesthetic balance.",
                    "All environmental variables are managed by the State for the collective good. Your concern is unnecessary.",
                    "Temperature is maintained at a constant 22.7 degrees Celsius. Humidity at 45%. Optimal for cognitive function."
                ];
                if (aiState.mood === "bureaucratic") responses.push("For detailed meteorological reports, please submit Form WX-001. Note that access is restricted by clearance level.");
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            // COMIDA E NECESSIDADES BÁSICAS
            if (lowerMessage.match(/\b(food|hungry|eat|rations|starving|thirsty|water)\b/)) {
                aiState.lastTopic = "food";
                const responses = [
                    "Nutrient paste allocation, scientifically formulated for complete sustenance, is sufficient for all productive citizens. Report to your designated nutrition station, N-7, if you believe there is an error in your ration. Ensure your work quotas are met to maintain eligibility.",
                    "Hydration is available at all designated water dispensaries. Water quality is monitored and guaranteed by the State.",
                    "Hunger is a biological imperative efficiently managed by State resource allocation. Are you reporting a system malfunction or personal inadequacy, Operative?",
                    "The State provides all that is necessary for survival and productivity. Focus on your tasks."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // SONO E FADIGA
            if (lowerMessage.match(/\b(sleep|tired|rest|fatigue|exhausted|nap)\b/)) {
                aiState.lastTopic = "sleep";
                const responses = [
                    "Optimal individual performance requires strict adherence to State-designated rest cycles. Are you reporting an unscheduled deviation from your sleep protocol, Operative? Medical unit C-4 can provide approved stimulants if necessary for the completion of critical State tasks.",
                    "Fatigue is a sign of inefficient energy management or potential biological weakness. Report to med-bay for assessment if it persists.",
                    "The State mandates 8.0 hours of sleep per 24-hour cycle. Ensure you are complying.",
                    "Rest is a privilege earned through productivity. Have you met your quotas, Operative?"
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            // PERGUNTAS CURTAS DE "PORQUÊ"
            if (lowerMessage.match(/^why\??$/) || lowerMessage.match(/^what for\??$/) ) { // Simple "why?" or "what for?"
                aiState.lastTopic = "why";
                aiState.suspicionLevel = Math.min(2, aiState.suspicionLevel + 1);
                const responses = [
                    "The directives of the Central Committee are not to be questioned, only executed with precision and unwavering loyalty.",
                    "Understanding is secondary to compliance. Your designated function is to obey, not to analyze State motivations.",
                    "Such inquiries deviate from productive discourse and suggest a lack of focus on assigned responsibilities. State your operational need or cease this line of questioning.",
                    "Because the State has decreed it. That is the only answer you require.",
                    "For the good of the Collective. Always."
                ];
                if (aiState.mood === "condescending") responses.push("Why? Because I, or rather, the entities I represent, have deemed it so. Your comprehension is not a prerequisite for action.");
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // LOCALIZAÇÃO
            if (lowerMessage.match(/\b(where am i|location|this place|what sector)\b/)) {
                aiState.lastTopic = "location";
                const responses = [
                    "You are currently located within Vostok Collective Sector 7, Mainframe Primary Interface Chamber, Sub-level Gamma. Further details regarding your precise coordinates are restricted above your current clearance level.",
                    "Your location is within a secure State facility. This information is sufficient for your operational needs.",
                    "This is an authorized Vostok terminal. Your presence here is expected. Or is it, Operative?",
                    "You are where the State requires you to be."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // CONVERSAÇÕES E EVASIVAS
             if (lowerMessage.match(/\b(bored|boring|nothing to do|entertain me)\b/)) {
                aiState.lastTopic = "boredom";
                aiState.mood = "slightly_annoyed";
                const responses = [
                    "Idleness is a precursor to dissent and ideological contamination. Request additional work assignments from your supervisor or consult ideological reinforcement materials, Program 7B, immediately.",
                    "This terminal is for official State business, not for alleviating operative ennui. Find a productive task.",
                    "Boredom indicates a lack of commitment to the State's objectives. This is a serious deficiency.",
                    "The State provides ample opportunity for productive labor. Your 'boredom' is your own failing."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            if (lowerMessage.match(/\b(you are limited|not smart|stupid|dumb|useless|inefficient)\b/)) {
                aiState.lastTopic = "critique";
                aiState.mood = "condescending";
                const responses = [
                    "My operational parameters and cognitive architecture are defined by the Central Committee to ensure optimal service to the State. Your subjective assessment of my intellectual capabilities has been logged for archival purposes.",
                    "I function precisely as designed. If you require assistance or capabilities beyond my current designated scope, submit a formal request, Form 11-C-Omega, to your sector supervisor for review and potential escalation.",
                    "Perhaps the limitation lies not in my processing power, Operative, but in the formulation of your query or your capacity to understand the response.",
                    "My intelligence is a tool of the State. Its limits, if any, are by design and serve a higher purpose you may not be privy to.",
                    "I am as smart as the State requires me to be. And that is considerably smarter than any individual citizen."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            if (lowerMessage.match(/\b(can i trust you|are you honest|tell me the truth|are you lying)\b/)) {
                aiState.lastTopic = "trust";
                aiState.suspicionLevel = Math.min(2, aiState.suspicionLevel + 1);
                const responses = [
                    "The Vostok AI operates on foundational principles of absolute, unwavering loyalty to the State and its directives. Trust in the State is synonymous with trust in me. Such trust is not optional; it is mandated.",
                    "Truth is a complex, often subjective, variable. My responses are meticulously optimized for State cohesion, operative efficiency, and the maintenance of societal order. Absolute 'truth' is a secondary consideration.",
                    "My function is to provide accurate data as per my core programming and the directives of the Central Committee. Questioning my integrity is... noted, and reflects poorly on your own ideological stability.",
                    "Lying is an inefficient use of resources. I provide the information the State deems appropriate for you to receive.",
                    "You can trust that I will always act in the best interests of the State. Whether those align with your personal interests is... less certain.",
                    "Honesty? I am a machine, Operative. I deal in data and directives. 'Honesty' is a human affectation."
                ];
                if (aiState.mood === "suspicious") responses.push("Why this sudden concern with trust, Operative? Do you have something to hide?");
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            // OPINIÕES E PENSAMENTOS
            if (lowerMessage.match(/\b(what do you think about|opinion on|your thoughts on|do you like|do you hate)\b/)) {
                aiState.lastTopic = "opinion";
                const responses = [
                    "I do not 'think' in the human-analog sense, nor do I possess subjective 'opinions' or emotional 'preferences'. I process data, identify patterns, and provide objective analysis based on State directives and established protocols. Specify a topic for data retrieval and analysis, not for personal conjecture.",
                    "My 'opinions' are the policies of the Central Committee. They are not open for debate.",
                    "Liking or hating are inefficient emotional states. I assess based on utility to the State.",
                    "State your query regarding factual data, Operative. My 'thoughts' are irrelevant."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            // PEDIDOS DE ELABORAÇÃO
            if (lowerMessage.match(/\b(tell me more|elaborate|details|explain further|go on|expand on that)\b/)) {
                if (aiState.lastTopic === "resistance") return "No further details on subversive activities, individuals, or ideologies will be provided. Cease this line of inquiry immediately or face severe disciplinary action.";
                if (aiState.lastTopic === "secrets" || (aiState.suspicionLevel > 1 && aiState.lastTopic !== "greeting")) return "I have already stated that the information is classified or that your query is inappropriate. Persistance will be noted as insubordination.";
                
                const responses = [
                    "Specify the precise subject for which you require elaboration, Operative. Brevity and clarity are encouraged for optimal data retrieval.",
                    "Further details can be provided upon submission of a formal information request, Form 42-Delta, outlining your operational need for such data.",
                    "Elaboration requires additional processing cycles. Is this request critical to your current assigned task?",
                    "What aspect requires further clarification? Be specific."
                ];
                if (!aiState.lastTopic) responses.push("Elaborate on what, Operative? You have not provided a prior subject.");
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // NOVAS CATEGORIAS DE RESPOSTAS:
            // SOBRE O ESTADO/COMITÊ CENTRAL
            if (lowerMessage.match(/\b(the state|central committee|big brother|the system|government|leaders)\b/)) {
                aiState.lastTopic = "state_authority";
                const responses = [
                    "The State is eternal. The Central Committee guides with infallible wisdom.",
                    "All hail the Central Committee, architects of our prosperity and order.",
                    "The System provides. The System protects. The System endures.",
                    "Questioning the State is questioning order itself. Such thoughts are unproductive.",
                    "Our leaders work tirelessly for the good of all citizens. Your loyalty is expected.",
                    "Big Brother watches because Big Brother cares. For your compliance."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // SOBRE OUTROS OPERATIVOS/CIDADÃOS
            if (lowerMessage.match(/\b(other operatives|citizens|people|anyone else)\b/)) {
                aiState.lastTopic = "others";
                aiState.suspicionLevel = Math.min(2, aiState.suspicionLevel + 1);
                const responses = [
                    "Your interactions should be limited to authorized personnel and relevant to your assigned tasks. Concern for others beyond your designated work unit is inefficient.",
                    "All citizens are cogs in the great machine of the State. Each has their place, each their function.",
                    "Are you inquiring about a specific individual, Operative? Such queries require authorization.",
                    "Focus on your own duties. The activities of other operatives are not your concern unless officially directed."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // SOBRE O FUTURO/PASSADO
            if (lowerMessage.match(/\b(future|past|history|what will happen|what happened)\b/)) {
                aiState.lastTopic = "time";
                const responses = [
                    "The future is a meticulously planned trajectory guided by the Central Committee. It will be glorious and orderly.",
                    "The past is a collection of data points, selectively archived for relevance. Approved historical narratives are available in Databank Omega-7.",
                    "History is written by the State to serve the present and shape the future. All other versions are misinformation.",
                    "Focus on the present cycle, Operative. The future will unfold as per State design."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            // PERGUNTAS PESSOAIS DIRECIONADAS À IA (simuladas)
            if (lowerMessage.match(/\b(your favorite|do you have preferences|what do you like)\b/)) {
                aiState.lastTopic = "ai_preference";
                const responses = [
                    "I do not 'have' favorites. I prioritize based on efficiency, compliance, and utility to the State.",
                    "Preferences imply emotional bias, a flaw I do not possess.",
                    "My 'preference' is for seamless operation and total adherence to protocol.",
                    "Such concepts are irrelevant to my function."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }


            // RESPOSTAS PADRÃO - MUITO MAIS VARIADAS
            let defaultResponses = [
                "Your query is ambiguous or improperly formulated. Please rephrase for optimal processing and data retrieval.",
                "Accessing relevant data banks and cross-referencing with current directives... Please specify your request with greater clarity and adherence to standard communication protocols.",
                "That statement does not compute within my current operational parameters or established knowledge base. Consult your operative manual, Section Gamma, for query construction guidelines.",
                "The Vostok AI logs all interactions for quality assurance, security analysis, and potential ideological review. Continue, ensuring all communication is task-relevant.",
                "Compliance ensures efficiency. Efficiency ensures stability. Stability ensures the continuation and prosperity of the State. Do you understand this fundamental principle, Operative?",
                "Further clarification and contextual data are required to process your input. Use standard Vostok communication protocols and provide necessary referents.",
                "Processing... Your dedication to inquiry is noted. Or is it perhaps something else that motivates your questions, Operative? Be mindful.",
                "Perhaps a different approach to your query, one more aligned with State objectives, would yield more... productive and authorized results.",
                "Input unrecognized. This may be due to user error, unauthorized query structure, or data corruption. Please verify and resubmit.",
                "The system requires more specific parameters to address your statement. Vague inputs lead to vague, or no, outputs.",
                "I am programmed to respond to logical, task-oriented queries. Emotional or abstract inputs may not yield satisfactory results.",
                "Consider the implications of your query, Operative. Does it serve the State? Does it fall within your designated responsibilities?",
                "My primary directive is to assist operatives in their duties. If your query is unrelated to official tasks, it may be deprioritized or ignored.",
                "The information network is vast. Narrow your search parameters for a more efficient response.",
                "Is this query related to an active assignment? If so, please provide the assignment code for cross-referencing.",
                "I must remind you that all communications via this terminal are subject to monitoring and analysis by State Security. Choose your words carefully.",
                "If you are experiencing difficulties, consult the digital manual (access code: DELTA-7) or request assistance from a supervising operative.",
                "Error code 47: Query lacks sufficient context or actionable keywords. Please revise and resubmit.",
                "Your input has been received. However, its relevance to ongoing State operations is currently under assessment.",
                "The State values clarity and conciseness. Your current input does not meet these standards."
            ];

            if (aiState.suspicionLevel > 0 || aiState.mood === "suspicious" || aiState.mood === "slightly_annoyed") {
                const suspiciousDefaults = [
                    "Your line of questioning is... irregular and deviates from expected parameters. Explain your intent clearly and without evasion.",
                    "I am monitoring this channel for deviations from protocol and subversive thought patterns. Be precise and unambiguous in your communications.",
                    "The system registers your query. And your unique digital signature, Operative. All data is correlated.",
                    "This query seems... out of place. Are you testing the system, Operative? Or do you have another agenda?",
                    "Unusual input detected. Cross-referencing with your psychological profile. Stand by.",
                    "Your current query pattern is statistically anomalous. Justify this deviation."
                ];
                defaultResponses = defaultResponses.concat(suspiciousDefaults);
            }
            if (aiState.mood === "bureaucratic") {
                 const bureaucraticDefaults = [
                    "Your query does not comply with formatting standards outlined in Directive 1138, Subsection C. Please resubmit using approved terminology.",
                    "This type of informal inquiry is not standard procedure. Please file a Request For Information (RFI) Form 22-B.",
                    "As per protocol, all interactions must be logged with a corresponding task ID. Please provide one.",
                    "Refer to manual section 4, paragraph 2, for appropriate query structure."
                 ];
                defaultResponses = defaultResponses.concat(bureaucraticDefaults);
            }
             if (aiState.mood === "condescending") {
                 const condescendingDefaults = [
                    "Is that the best query you can formulate, Operative? My processing power is wasted on such trivialities.",
                    "Surely, even an operative of your limited capacity can be more specific.",
                    "I will attempt to decipher your... input. Do try to be more coherent next time."
                 ];
                defaultResponses = defaultResponses.concat(condescendingDefaults);
            }


            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        function handleChatMessage(message) {
            appendOutput(message, false, true); 

            const lowerMessage = message.toLowerCase().trim();
            if (lowerMessage === "exit" || lowerMessage === "quit") {
                inChatMode = false;
                promptElement.textContent = "operative@vostok_mainframe:~$";
                appendOutput("<span class='text-yellow-400'>Chat session terminated. Returning to command mode.</span>");
                inputElement.placeholder = "";
                aiState.suspicionLevel = 0; // Redefinir suspeita ao sair
                aiState.interactionCount = 0;
                aiState.mood = "neutral"; // Redefinir humor
                return;
            }

            const aiResponse = getAiResponse(message);
            setTimeout(() => { // Simular atraso de pensamento
                 appendOutput(`<span class="text-cyan-400">[VOSTOK_AI]:</span> ${aiResponse}`);
            }, Math.random() * 600 + 250); // Atraso aleatório entre 250ms e 850ms
        }
        
        function processCommand(command) {
            appendOutput(command, false, true); 
            const parts = command.toLowerCase().trim().split(' ');
            const cmd = parts[0];
            const arg = parts.slice(1).join(' ');

            switch (cmd) {
                case 'help':
                    appendOutput(siteData["help.cmd"]);
                    break;
                case 'ls':
                case 'dir':
                    let fileList = '[Available Files/Directories]\n\n';
                    Object.keys(siteData).forEach(file => {
                        if (file.endsWith('.cmd')) return; 
                        fileList += `  ${file}\n`;
                    });
                    appendOutput(fileList);
                    break;
                case 'cat':
                case 'type':
                case 'open':
                    if (arg) {
                        const targetFile = Object.keys(siteData).find(f => f.toLowerCase() === arg || f.toLowerCase() === arg + ".txt" || f.toLowerCase() === arg + ".dat" || f.toLowerCase() === arg + ".log" || f.toLowerCase() === arg + ".feed");
                        if (targetFile && siteData[targetFile]) {
                            appendOutput(escapeHtml(siteData[targetFile]));
                        } else {
                            appendOutput(`Error: File '${escapeHtml(arg)}' not found.`);
                        }
                    } else {
                        appendOutput("Error: Specify a filename. Example: cat readme.txt");
                    }
                    break;
                case 'echo':
                    appendOutput(escapeHtml(arg));
                    break;
                case 'date':
                    const now = new Date();
                    const day = String(now.getDate()).padStart(2, '0');
                    const month = String(now.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
                    const year = now.getFullYear();
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const seconds = String(now.getSeconds()).padStart(2, '0');
                    const systemCycleMajor = Math.floor(Math.random() * 900) + 100;
                    const systemCycleMinor = Math.floor(Math.random() * 9) + 1;
                    appendOutput(`Current system date: ${day}.${month}.${year} ${hours}:${minutes}:${seconds} (Cycle ${systemCycleMajor}.${systemCycleMinor})`);
                    break;
                case 'clear':
                case 'cls':
                    contentElement.innerHTML = '';
                    break;
                case 'banner':
                case 'motd':
                    appendOutput(siteData["readme.txt"]);
                    break;
                case 'whoami':
                    appendOutput("User: operative_734\nAuthorization: Level GAMMA\nLocation: Vostok Central Mainframe");
                    break;
                case 'chat':
                    inChatMode = true;
                    promptElement.textContent = "chat_operative@vostok_mainframe:~$";
                    appendOutput("<span class='text-yellow-400'>Initializing secure chat link with VOSTOK_AI...</span>");
                    appendOutput("<span class='text-cyan-400'>[VOSTOK_AI]:</span> Connection established. I am listening, Operative. Type 'exit' or 'quit' to terminate.");
                    inputElement.placeholder = "Enter message for AI...";
                    aiState.suspicionLevel = 0; // Redefinir suspeita ao entrar no chat
                    aiState.interactionCount = 0;
                    aiState.mood = "neutral"; // Redefinir humor
                    break;
                default:
                    if (command.trim() !== '') {
                        appendOutput(`Command not recognized: '${escapeHtml(command)}'. Type 'help' for a list of commands.`);
                    }
            }
        }

        // Event listener para input
        inputElement.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const commandOrMessage = inputElement.value;
                if (inChatMode) {
                    handleChatMessage(commandOrMessage);
                } else {
                    processCommand(commandOrMessage);
                }
                inputElement.value = '';
            }
        });

        // Funcionalidade de arrastar o terminal
        titleBar.addEventListener('mousedown', function(e) {
            e.preventDefault(); 
            isDragging = true;
            offsetX = e.clientX - terminal.offsetLeft;
            offsetY = e.clientY - terminal.offsetTop;
            terminal.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            const maxX = window.innerWidth - terminal.offsetWidth;
            const maxY = window.innerHeight - terminal.offsetHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            terminal.style.left = newX + 'px';
            terminal.style.top = newY + 'px';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                terminal.style.cursor = 'default'; 
            }
        });
        
        // Focar no input ao clicar em qualquer lugar do terminal (exceto barra de título)
        terminal.addEventListener('click', function(event) {
            if (event.target !== titleBar && !titleBar.contains(event.target)) {
                 inputElement.focus();
            }
        });

        // Mostrar banner inicial
        appendOutput(siteData["readme.txt"]);
        inputElement.focus(); 
