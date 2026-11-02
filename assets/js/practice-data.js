window.IB_PRACTICE_QUESTIONS = [
  {
    "id": "q-a1-1",
    "theme": "A",
    "unit": "A1",
    "unitName": "Computer Fundamentals",
    "subtopicCode": "A1.1",
    "subtopicName": "Computer hardware and operation",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section A",
    "skill": "Recall/Concept",
    "marks": 2,
    "origin": "Specimen Paper 1",
    "prompt": "State one architectural difference between a central processing unit (CPU) and a graphics processing unit (GPU).",
    "hint": "Consider the number of execution cores and the types of workloads they are optimized for (low-latency sequential vs high-throughput parallel).",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "CPU: Engineered for low-latency sequential execution containing relatively few, high-performance cores with sophisticated control logic and large caches.",
        "marks": 1
      },
      {
        "point": "GPU: Engineered for high-throughput data-parallel execution containing hundreds or thousands of smaller, energy-efficient cores optimized for matrix and arithmetic operations.",
        "marks": 1
      }
    ],
    "examinerTip": "Avoid colloquial responses such as 'GPUs are for gaming'. Always emphasize architectural differences like sequential vs massively parallel execution cores."
  },
  {
    "id": "q-a1-2",
    "theme": "A",
    "unit": "A1",
    "unitName": "Computer Fundamentals",
    "subtopicCode": "A1.1",
    "subtopicName": "Computer hardware and operation",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Tracing/Dry Run",
    "marks": 4,
    "origin": "Syllabus Exemplar",
    "prompt": "Explain the role of the Program Counter (PC), Memory Address Register (MAR), Memory Data Register (MDR), and Current Instruction Register (CIR) during the Fetch stage of the machine cycle.",
    "hint": "Trace how the address moves from the PC across the address bus to fetch the instruction word into the processor.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "The Program Counter (PC) holds the memory address of the next instruction to be fetched; this address is copied to the Memory Address Register (MAR).",
        "marks": 1
      },
      {
        "point": "The Control Unit asserts a read signal on the control bus, loading the instruction data from RAM via the data bus into the Memory Data Register (MDR).",
        "marks": 1
      },
      {
        "point": "The PC is incremented to point to the subsequent sequential memory address.",
        "marks": 1
      },
      {
        "point": "The instruction is transferred from the MDR into the Current Instruction Register (CIR) where it will be decoded.",
        "marks": 1
      }
    ],
    "examinerTip": "Always explicitly mention that the PC is incremented during or immediately after the fetch step."
  },
  {
    "id": "q-a1-3",
    "theme": "A",
    "unit": "A1",
    "unitName": "Computer Fundamentals",
    "subtopicCode": "A1.2",
    "subtopicName": "Data representation and computer logic",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section A",
    "skill": "Recall/Concept",
    "marks": 3,
    "origin": "Syllabus Practice",
    "prompt": "Construct the truth table for the Boolean expression: X = (A AND B) NOR (NOT C).",
    "hint": "Evaluate the terms step by step: first calculate (A AND B), then (NOT C), and finally invert the OR combination of both.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Correct evaluation of sub-expression (A AND B) across all 8 combinations [1 mark].",
        "marks": 1
      },
      {
        "point": "Correct evaluation of (NOT C) across all 8 combinations [1 mark].",
        "marks": 1
      },
      {
        "point": "Final output column X is true (1) only when both (A AND B) is 0 and (NOT C) is 0 [i.e., C is 1 and not both A and B are 1] [1 mark].",
        "marks": 1
      }
    ],
    "examinerTip": "Ensure your truth table rows follow standard ascending binary order (000, 001, 010, ... 111) to avoid indexing mistakes."
  },
  {
    "id": "q-a1-4",
    "theme": "A",
    "unit": "A1",
    "unitName": "Computer Fundamentals",
    "subtopicCode": "A1.3",
    "subtopicName": "Operating systems and control systems",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section A",
    "skill": "Evaluation/Discussion",
    "marks": 3,
    "origin": "Syllabus Exemplar",
    "prompt": "Compare the use of polling versus hardware interrupts for an embedded autonomous rover that monitors obstacle collision sensors.",
    "hint": "Think about CPU cycles wasted during polling and latency requirements when an immediate collision avoidance maneuver is required.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Polling repeatedly checks the sensor status in a loop, consuming valuable CPU cycles and power even when no obstacle is present.",
        "marks": 1
      },
      {
        "point": "Interrupts allow the processor to execute mission tasks uninterrupted until an obstacle trigger asserts a hardware line, providing deterministic, low-latency response.",
        "marks": 1
      },
      {
        "point": "For collision sensors, interrupts prevent buffer delay or missed triggers that could cause physical crashes.",
        "marks": 1
      }
    ],
    "examinerTip": "Highlight the real-time safety implications: polling latency could cause sensor overruns."
  },
  {
    "id": "q-a1-5",
    "theme": "A",
    "unit": "A1",
    "unitName": "Computer Fundamentals",
    "subtopicCode": "A1.4",
    "subtopicName": "Translation (HL only)",
    "level": "HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Recall/Concept",
    "marks": 4,
    "origin": "Higher Level Specimen",
    "prompt": "Outline the four principal phases of compilation (lexical analysis, syntax analysis, semantic analysis, code generation/optimization).",
    "hint": "Trace how raw source code strings are tokenized, parsed into an abstract syntax tree (AST), type-checked, and finally converted to machine binaries.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Lexical Analysis: Scans source characters, strips comments and whitespace, and groups lexemes into tokens while populating the symbol table.",
        "marks": 1
      },
      {
        "point": "Syntax Analysis: Validates token sequences against programming language grammar and constructs a Parse Tree or Abstract Syntax Tree (AST).",
        "marks": 1
      },
      {
        "point": "Semantic Analysis: Checks type compatibility, variable declarations, and scope consistency across the symbol table.",
        "marks": 1
      },
      {
        "point": "Code Generation & Optimization: Emits intermediate/machine code and performs register allocation and dead-code elimination to improve speed.",
        "marks": 1
      }
    ],
    "examinerTip": "Clearly distinguish between syntax errors (violating grammar rules) and semantic errors (type mismatches or undeclared identifiers)."
  },
  {
    "id": "q-a2-1",
    "theme": "A",
    "unit": "A2",
    "unitName": "Networks",
    "subtopicCode": "A2.1",
    "subtopicName": "Network fundamentals",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Easy",
    "format": "Section A",
    "skill": "Recall/Concept",
    "marks": 2,
    "origin": "Syllabus Practice",
    "prompt": "Distinguish between a Local Area Network (LAN) and a Wide Area Network (WAN) in terms of geographical span and ownership of telecommunication infrastructure.",
    "hint": "Consider who owns the transmission lines and whether the network is restricted to a single building/campus.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Geographical Span: A LAN covers a small geographic area (e.g. single office, building, or school campus), whereas a WAN covers broad geographical areas (e.g. cities, nations, or continents).",
        "marks": 1
      },
      {
        "point": "Infrastructure Ownership: LAN hardware/cables are owned and administered directly by the organization; WAN connections rely on leased public telecommunications carriers/ISPs.",
        "marks": 1
      }
    ],
    "examinerTip": "Be precise regarding ownership: private vs leased/public telecommunication infrastructure."
  },
  {
    "id": "q-a2-2",
    "theme": "A",
    "unit": "A2",
    "unitName": "Networks",
    "subtopicCode": "A2.2",
    "subtopicName": "Network architecture",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section A",
    "skill": "Recall/Concept",
    "marks": 3,
    "origin": "Syllabus Exemplar",
    "prompt": "Describe how packet switching routes data across the Internet, mentioning packet headers, routing decisions, and destination reassembly.",
    "hint": "Recall that data is split into independent units that can traverse different physical links.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Data payload is divided into standardized chunks called packets, each prepended with a header containing source/destination IP addresses and sequence numbers.",
        "marks": 1
      },
      {
        "point": "Routers independently inspect headers and forward packets dynamically along optimal paths based on current network congestion and routing tables.",
        "marks": 1
      },
      {
        "point": "At the destination host, the TCP/IP stack checks checksums, re-orders packets using sequence numbers, and requests retransmission of dropped packets.",
        "marks": 1
      }
    ],
    "examinerTip": "Emphasize that packets can take completely different geographic routes and arrive out of order."
  },
  {
    "id": "q-a2-3",
    "theme": "A",
    "unit": "A2",
    "unitName": "Networks",
    "subtopicCode": "A2.4",
    "subtopicName": "Network security",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 4,
    "origin": "Specimen Paper 1",
    "prompt": "Explain how asymmetric encryption and digital certificates guarantee both confidentiality and authentication during an HTTPS session establishment.",
    "hint": "Contrast public key encryption for key exchange with certificate authority (CA) digital signatures.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Digital Certificate: The server presents a certificate signed by a trusted Certificate Authority (CA) containing its public key, verifying the authentic identity of the web domain.",
        "marks": 1
      },
      {
        "point": "Authentication: The client verifies the CA's digital signature using the CA's pre-installed public key, preventing man-in-the-middle spoofing.",
        "marks": 1
      },
      {
        "point": "Asymmetric Key Exchange: The client generates a random symmetric session key, encrypts it using the server's public key, and sends it to the server.",
        "marks": 1
      },
      {
        "point": "Confidentiality: Only the server holding the matching private key can decrypt this session key; subsequent traffic uses high-speed symmetric encryption.",
        "marks": 1
      }
    ],
    "examinerTip": "Make sure you explain why asymmetric encryption is used only for the initial handshake (performance overhead) while symmetric is used for streaming payload."
  },
  {
    "id": "q-a3-1",
    "theme": "A",
    "unit": "A3",
    "unitName": "Databases",
    "subtopicCode": "A3.2",
    "subtopicName": "Database design",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 4,
    "origin": "Syllabus Exemplar",
    "prompt": "A student database contains a table with columns: (StudentID, StudentName, CourseCode, CourseTitle, InstructorName, InstructorOffice).\n\nExplain why this table violates Second Normal Form (2NF) and Third Normal Form (3NF), and outline how to decompose it.",
    "hint": "Identify the composite candidate key (StudentID, CourseCode), look for partial functional dependencies, and identify transitive dependencies.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "2NF Violation: The primary key is composite (StudentID, CourseCode). StudentName depends only on StudentID, and CourseTitle depends only on CourseCode (partial functional dependency).",
        "marks": 1
      },
      {
        "point": "3NF Violation: InstructorOffice depends on InstructorName (non-key attribute determines another non-key attribute: transitive dependency).",
        "marks": 1
      },
      {
        "point": "Decomposition Step 1: Create separate Student table (StudentID, StudentName) and Course table (CourseCode, CourseTitle, InstructorID).",
        "marks": 1
      },
      {
        "point": "Decomposition Step 2: Create Instructor table (InstructorID, InstructorName, InstructorOffice) and StudentEnrollment junction table (StudentID, CourseCode).",
        "marks": 1
      }
    ],
    "examinerTip": "Remember: 2NF requires removing partial dependencies on composite keys; 3NF requires removing transitive dependencies between non-key attributes."
  },
  {
    "id": "q-a3-2",
    "theme": "A",
    "unit": "A3",
    "unitName": "Databases",
    "subtopicCode": "A3.3",
    "subtopicName": "Database programming",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Coding/Query",
    "skill": "Code Implementation",
    "marks": 3,
    "origin": "Syllabus Practice",
    "prompt": "Given two tables:\n- Students (student_id, full_name, cohort_year)\n- Scores (score_id, student_id, paper_number, marks_earned)\n\nWrite an SQL query to display the full_name and average marks earned for students in cohort_year '2026', showing only students whose average score exceeds 80, sorted descending by average mark.",
    "hint": "Use an INNER JOIN, GROUP BY, HAVING clause, and ORDER BY.",
    "codeSnippet": "SELECT Students.full_name, AVG(Scores.marks_earned) AS avg_mark\nFROM Students\nJOIN Scores ON Students.student_id = Scores.student_id\nWHERE Students.cohort_year = '2026'\nGROUP BY Students.student_id, Students.full_name\nHAVING AVG(Scores.marks_earned) > 80\nORDER BY avg_mark DESC;",
    "markScheme": [
      {
        "point": "Correct SELECT and INNER JOIN syntax connecting Students.student_id = Scores.student_id [1 mark].",
        "marks": 1
      },
      {
        "point": "Correct WHERE condition for cohort_year = '2026' and GROUP BY clause [1 mark].",
        "marks": 1
      },
      {
        "point": "Correct HAVING AVG(marks_earned) > 80 condition and ORDER BY DESC [1 mark].",
        "marks": 1
      }
    ],
    "examinerTip": "Remember that WHERE filters rows before aggregation, while HAVING filters aggregated group metrics."
  },
  {
    "id": "q-a3-3",
    "theme": "A",
    "unit": "A3",
    "unitName": "Databases",
    "subtopicCode": "A3.4",
    "subtopicName": "Alternative databases and data warehouses (HL only)",
    "level": "HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 3,
    "origin": "Higher Level Exemplar",
    "prompt": "Evaluate when a document-oriented NoSQL database (such as MongoDB) is preferable over a strict relational database (RDBMS) for an IoT telemetry platform.",
    "hint": "Consider schema flexibility, horizontal write-scaling, and polymorphic sensor payloads.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Schema Flexibility: Different IoT sensor models emit varying telemetry schemas without requiring costly database ALTER TABLE migrations.",
        "marks": 1
      },
      {
        "point": "Horizontal Scalability: Document stores naturally shard across distributed server clusters to handle high-frequency time-series write volumes.",
        "marks": 1
      },
      {
        "point": "Trade-off Consideration: NoSQL sacrifices multi-document ACID transactions and complex relational joins in favor of write throughput and availability.",
        "marks": 1
      }
    ],
    "examinerTip": "Always balance an evaluation by discussing the trade-offs (e.g. eventual consistency vs strict relational constraints)."
  },
  {
    "id": "q-a4-1",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.1",
    "subtopicName": "Machine learning fundamentals",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Easy",
    "format": "Section A",
    "skill": "Recall/Concept",
    "marks": 2,
    "origin": "Syllabus Practice",
    "prompt": "Distinguish between supervised learning and unsupervised learning, providing one representative application for each.",
    "hint": "Think about the presence or absence of labeled target output data.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Supervised Learning: Trained on input-output pairs with known ground-truth labels (e.g. email spam classification, medical image diagnosis).",
        "marks": 1
      },
      {
        "point": "Unsupervised Learning: Discovers hidden patterns, clusters, or relationships in unlabeled data without explicit targets (e.g. customer market segmentation, anomaly detection).",
        "marks": 1
      }
    ],
    "examinerTip": "Clearly state the role of labeled training data."
  },
  {
    "id": "q-a4-2",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.3",
    "subtopicName": "Machine learning approaches (HL only)",
    "level": "HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 4,
    "origin": "Higher Level Specimen",
    "prompt": "Explain the problem of overfitting in an artificial neural network and discuss two techniques used during training to mitigate it.",
    "hint": "What happens when a model memorizes training noise instead of learning generalizable representations? Mention dropout, regularisation, or early stopping.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Overfitting Explanation: The network fits the training dataset too closely, capturing random statistical noise and specific details, leading to poor generalization on unseen validation data.",
        "marks": 1
      },
      {
        "point": "Mitigation 1 (Dropout): Randomly deactivates a fraction of neurons during each forward-backward training pass, forcing the network to learn redundant, co-adapted representations.",
        "marks": 1
      },
      {
        "point": "Mitigation 2 (Early Stopping): Monitors performance against a separated validation set and halts training iterations once validation loss begins to diverge.",
        "marks": 1
      },
      {
        "point": "Alternative Mitigation (Data Augmentation / L2 Regularization): Penalisies large weight vectors or artificially expands sample diversity.",
        "marks": 1
      }
    ],
    "examinerTip": "Illustrate with the relationship between training error (continuously drops) and validation error (starts rising)."
  },
  {
    "id": "q-a4-3",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section A",
    "skill": "Evaluation/Discussion",
    "marks": 3,
    "origin": "Syllabus Practice",
    "prompt": "Discuss two sources of algorithmic bias in an automated university admissions screening model, and state one measure to audit for fairness.",
    "hint": "Consider historical human training bias and underrepresentation in the dataset.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Historical Training Bias: Historical admissions data reflects past human prejudices and systemic inequities which the algorithm codifies and amplifies.",
        "marks": 1
      },
      {
        "point": "Sampling Underrepresentation: If minority demographics are sparsely represented in training cohorts, the model produces higher variance and erroneous rejections.",
        "marks": 1
      },
      {
        "point": "Fairness Audit: Perform demographic parity testing or counterfactual evaluation across protected characteristics to measure disparate impact.",
        "marks": 1
      }
    ],
    "examinerTip": "Ensure you address both the training data genesis and algorithmic mitigation."
  },
  {
    "id": "q-b1-1",
    "theme": "B",
    "unit": "B1",
    "unitName": "Computational Thinking",
    "subtopicCode": "B1.1",
    "subtopicName": "Approaches to computational thinking",
    "level": "SL/HL",
    "paper": 2,
    "difficulty": "Easy",
    "format": "Section A",
    "skill": "Recall/Concept",
    "marks": 3,
    "origin": "Specimen Paper 2",
    "prompt": "Outline the four core cornerstones of computational thinking: decomposition, pattern recognition, abstraction, and algorithmic design.",
    "hint": "Define how complex real-world problems are broken down, simplified, and generalized into executable procedures.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Decomposition: Breaking down a complex problem or system into smaller, more manageable sub-components.",
        "marks": 1
      },
      {
        "point": "Pattern Recognition: Identifying recurring trends, similarities, or characteristics among decomposed sub-problems.",
        "marks": 1
      },
      {
        "point": "Abstraction & Algorithm Design: Filtering out non-essential background details to focus on core concepts, then developing a step-by-step procedural sequence to solve the problem.",
        "marks": 1
      }
    ],
    "examinerTip": "Use precise definitions rather than casual restatements."
  },
  {
    "id": "q-b2-1",
    "theme": "B",
    "unit": "B2",
    "unitName": "Programming",
    "subtopicCode": "B2.1",
    "subtopicName": "Programming fundamentals",
    "level": "SL/HL",
    "paper": 2,
    "difficulty": "Medium",
    "format": "Coding/Query",
    "skill": "Code Implementation",
    "marks": 3,
    "origin": "Syllabus Practice",
    "prompt": "Write a Python function `filter_valid_scores(scores_list, minimum_pass)` that takes a list of numeric exam scores and returns a new list containing only scores that are greater than or equal to `minimum_pass`, ignoring any negative values.",
    "hint": "Initialize an accumulator list and iterate through each score with a conditional filter.",
    "codeSnippet": "def filter_valid_scores(scores_list, minimum_pass):\n    valid = []\n    for score in scores_list:\n        if score >= 0 and score >= minimum_pass:\n            valid.append(score)\n    return valid",
    "markScheme": [
      {
        "point": "Correct function header with two parameters and initializing an empty list [1 mark].",
        "marks": 1
      },
      {
        "point": "Correct iteration loop through scores_list with condition checking score >= 0 and score >= minimum_pass [1 mark].",
        "marks": 1
      },
      {
        "point": "Appending qualifying scores to the result list and returning it correctly [1 mark].",
        "marks": 1
      }
    ],
    "examinerTip": "Ensure code handles edge cases like empty lists cleanly without raising IndexError."
  },
  {
    "id": "q-b2-2",
    "theme": "B",
    "unit": "B2",
    "unitName": "Programming",
    "subtopicCode": "B2.4",
    "subtopicName": "Programming algorithms",
    "level": "SL/HL",
    "paper": 2,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Tracing/Dry Run",
    "marks": 4,
    "origin": "Specimen Paper 2",
    "prompt": "Construct a trace table to trace the binary search algorithm searching for key `37` in the sorted list:\n`nums = [11, 19, 24, 31, 37, 45, 59, 72, 88]`\n\nShow the values of `low`, `high`, `mid`, and `nums[mid]` for each iteration until the value is found.",
    "hint": "List indices range from 0 to 8. Calculate mid = (low + high) // 2.",
    "codeSnippet": "low = 0\nhigh = len(nums) - 1\n# Iteration 1: low=0, high=8, mid=4 -> nums[4] = 37. Found!",
    "markScheme": [
      {
        "point": "Iteration 1: low=0, high=8, mid=4 [1 mark].",
        "marks": 1
      },
      {
        "point": "Evaluating nums[4] = 37 [1 mark].",
        "marks": 1
      },
      {
        "point": "Recognizing nums[mid] == key on the first inspection and returning index 4 [2 marks].",
        "marks": 2
      }
    ],
    "examinerTip": "Always explicitly state indices as 0-indexed integers."
  },
  {
    "id": "q-b2-3",
    "theme": "B",
    "unit": "B2",
    "unitName": "Programming",
    "subtopicCode": "B2.4",
    "subtopicName": "Programming algorithms",
    "level": "SL/HL",
    "paper": 2,
    "difficulty": "Hard",
    "format": "Coding/Query",
    "skill": "Code Implementation",
    "marks": 5,
    "origin": "Syllabus Exemplar",
    "prompt": "Write a complete Python implementation of the Bubble Sort algorithm to sort a list of numbers in ascending order in-place, optimized with an early-exit flag if no swaps occur during a pass.",
    "hint": "Use nested loops: the outer loop runs up to n-1 passes, and the inner loop compares adjacent elements `arr[j]` and `arr[j+1]`.",
    "codeSnippet": "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n - 1):\n        swapped = False\n        for j in range(n - 1 - i):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr",
    "markScheme": [
      {
        "point": "Outer loop running up to n-1 iterations [1 mark].",
        "marks": 1
      },
      {
        "point": "Inner loop bound correctly to n-1-i to avoid comparing already sorted terminal elements [1 mark].",
        "marks": 1
      },
      {
        "point": "Correct comparison of adjacent elements and Python tuple swapping syntax [1 mark].",
        "marks": 1
      },
      {
        "point": "Correct implementation of early-exit boolean flag `swapped` [1 mark].",
        "marks": 1
      },
      {
        "point": "Returning or preserving in-place sorted list [1 mark].",
        "marks": 1
      }
    ],
    "examinerTip": "Explain how the swapped flag improves best-case time complexity from O(n²) to O(n) for already sorted arrays."
  },
  {
    "id": "q-b3-1",
    "theme": "B",
    "unit": "B3",
    "unitName": "Object-Oriented Programming",
    "subtopicCode": "B3.1",
    "subtopicName": "Fundamentals of OOP for a single class",
    "level": "SL/HL",
    "paper": 2,
    "difficulty": "Medium",
    "format": "Coding/Query",
    "skill": "Code Implementation",
    "marks": 4,
    "origin": "Syllabus Practice",
    "prompt": "Define a Python class `BankAccount` with encapsulated instance attributes `__account_number` (string) and `__balance` (float, initialized to 0.0).\n\nInclude:\n1. A constructor `__init__(self, account_number, initial_deposit=0.0)`.\n2. A method `deposit(self, amount)` that adds positive amounts.\n3. A method `withdraw(self, amount)` that deducts funds only if sufficient balance exists and returns True, else returns False.",
    "hint": "Use double underscores `__` for private attribute encapsulation.",
    "codeSnippet": "class BankAccount:\n    def __init__(self, account_number, initial_deposit=0.0):\n        self.__account_number = account_number\n        self.__balance = float(initial_deposit) if initial_deposit > 0 else 0.0\n\n    def deposit(self, amount):\n        if amount > 0:\n            self.__balance += amount\n            return True\n        return False\n\n    def withdraw(self, amount):\n        if 0 < amount <= self.__balance:\n            self.__balance -= amount\n            return True\n        return False\n\n    def get_balance(self):\n        return self.__balance",
    "markScheme": [
      {
        "point": "Correct constructor definition with private attributes initialized [1 mark].",
        "marks": 1
      },
      {
        "point": "Deposit method validating amount > 0 and updating balance [1 mark].",
        "marks": 1
      },
      {
        "point": "Withdraw method validating amount > 0 and amount <= balance, returning boolean status [1 mark].",
        "marks": 1
      },
      {
        "point": "Proper encapsulation maintaining data integrity [1 mark].",
        "marks": 1
      }
    ],
    "examinerTip": "Avoid direct public attribute modification from outside methods (encapsulation principle)."
  },
  {
    "id": "q-b3-2",
    "theme": "B",
    "unit": "B3",
    "unitName": "Object-Oriented Programming",
    "subtopicCode": "B3.2",
    "subtopicName": "Fundamentals of OOP for multiple classes (HL only)",
    "level": "HL",
    "paper": 2,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Code Implementation",
    "marks": 5,
    "origin": "Higher Level Specimen",
    "prompt": "Explain polymorphism and inheritance in Python by extending the `BankAccount` base class with a subclass `SavingsAccount` that adds an annual `interest_rate` attribute and an `apply_interest()` method.",
    "hint": "Use `super().__init__(...)` to call the superclass constructor.",
    "codeSnippet": "class SavingsAccount(BankAccount):\n    def __init__(self, account_number, initial_deposit=0.0, interest_rate=0.04):\n        super().__init__(account_number, initial_deposit)\n        self.__interest_rate = interest_rate\n\n    def apply_interest(self):\n        interest = self.get_balance() * self.__interest_rate\n        self.deposit(interest)\n        return interest",
    "markScheme": [
      {
        "point": "Correct inheritance syntax `class SavingsAccount(BankAccount)` [1 mark].",
        "marks": 1
      },
      {
        "point": "Use of `super().__init__(...)` passing parameters to superclass [1 mark].",
        "marks": 1
      },
      {
        "point": "Adding specific subclass attribute `interest_rate` with encapsulation [1 mark].",
        "marks": 1
      },
      {
        "point": "Implementation of `apply_interest()` calling getter and deposit methods [1 mark].",
        "marks": 1
      },
      {
        "point": "Clear written explanation of polymorphism (shared interface allowing varied subclass behaviors) [1 mark].",
        "marks": 1
      }
    ],
    "examinerTip": "Always demonstrate calling the superclass constructor when overriding `__init__`."
  },
  {
    "id": "q-b4-1",
    "theme": "B",
    "unit": "B4",
    "unitName": "Abstract Data Types (ADTs)",
    "subtopicCode": "B4.1",
    "subtopicName": "Fundamentals of ADTs",
    "level": "SL/HL",
    "paper": 2,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Code Implementation",
    "marks": 4,
    "origin": "Syllabus Exemplar",
    "prompt": "Implement a Queue abstract data type using a Python list that follows the First-In-First-Out (FIFO) principle, providing `enqueue(item)`, `dequeue()`, `is_empty()`, and `peek()` methods.",
    "hint": "Enqueue appends to the tail; dequeue removes and returns element from index 0.",
    "codeSnippet": "class Queue:\n    def __init__(self):\n        self.__items = []\n\n    def enqueue(self, item):\n        self.__items.append(item)\n\n    def dequeue(self):\n        if self.is_empty():\n            raise IndexError('dequeue from empty queue')\n        return self.__items.pop(0)\n\n    def peek(self):\n        if self.is_empty():\n            return None\n        return self.__items[0]\n\n    def is_empty(self):\n        return len(self.__items) == 0",
    "markScheme": [
      {
        "point": "Correct initialization of internal storage list [1 mark].",
        "marks": 1
      },
      {
        "point": "Enqueue appending to the back of the queue [1 mark].",
        "marks": 1
      },
      {
        "point": "Dequeue removing from index 0 with empty queue validation [1 mark].",
        "marks": 1
      },
      {
        "point": "Is_empty and peek correctly inspecting front item without mutation [1 mark].",
        "marks": 1
      }
    ],
    "examinerTip": "State the time complexity implication: `pop(0)` on standard lists takes O(n); in production `collections.deque` is preferred for O(1)."
  },
  {
    "id": "q-cs-2027-1",
    "theme": "CaseStudy",
    "unit": "CS",
    "unitName": "2027 Case Study: Generative AI for Image Creation",
    "subtopicCode": "CS.1",
    "subtopicName": "Iterative Denoising & Computational Trade-offs",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section B Short",
    "skill": "Analysis/Explanation",
    "marks": 4,
    "origin": "2027 Pre-Seen Case Study (Visionary Studios)",
    "prompt": "Visionary Studios is evaluating the computational requirements of Denoising Diffusion Probabilistic Models (DDPMs) for generating client advertising drafts.\n\n(a) Outline the role of the Markov chain and Gaussian noise schedule during the forward diffusion process. [2 marks]\n\n(b) Explain why the reverse denoising process creates a computational latency bottleneck when generating high-resolution images, and explain how a modern scheduler (e.g. DDIM) mitigates this latency. [2 marks]",
    "hint": "Consider the predetermined variance schedule beta_t in forward diffusion vs the sequential iterative evaluation of the U-Net in reverse sampling.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Forward Process: In forward diffusion, Gaussian noise is iteratively injected into an image over T discrete timesteps according to a predetermined noise schedule (beta_t). The Markov property ensures each noisy state x_t depends solely on the immediate previous state x_(t-1), asymptotically transforming the image into pure isotropic Gaussian noise.",
        "marks": 2
      },
      {
        "point": "(b) Reverse Bottleneck: The reverse denoising process cannot jump straight to the clean image; the neural network (U-Net) must be executed iteratively across all timesteps (e.g., T=1000) to estimate and subtract noise step-by-step, demanding significant GPU FLOPs and wall-clock latency per generation.",
        "marks": 1
      },
      {
        "point": "(b) Scheduler Mitigation: Non-Markovian deterministic schedulers (such as Denoising Diffusion Implicit Models - DDIM) skip intermediate steps during inference, enabling high-fidelity image synthesis in as few as 20 to 50 steps instead of 1000, slashing production latency for client drafts.",
        "marks": 1
      }
    ],
    "examinerTip": "Distinguish clearly between the forward process (which has an analytical closed-form jump during training) and the reverse process (which is strictly sequential during inference)."
  },
  {
    "id": "q-cs-2027-2",
    "theme": "CaseStudy",
    "unit": "CS",
    "unitName": "2027 Case Study: Generative AI for Image Creation",
    "subtopicCode": "CS.1",
    "subtopicName": "Dataset Curation, Copyright & Bias Mitigation",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section B Short",
    "skill": "Evaluation/Discussion",
    "marks": 4,
    "origin": "2027 Pre-Seen Case Study (Visionary Studios)",
    "prompt": "Visionary Studios plans to fine-tune an image generation model using scraped web artwork for commercial client brand campaigns.\n\n(a) Explain one legal or copyright risk Visionary Studios faces if copyrighted artistic works are included in their model training dataset without explicit licensing. [2 marks]\n\n(b) Describe two proactive data governance or technical measures Visionary Studios should implement to protect against intellectual property infringement and algorithmic bias. [2 marks]",
    "hint": "Address model memorization, commercial indemnity liability, C2PA content provenance, and demographic bias auditing.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Legal/Copyright Risk: Scraping copyrighted artwork without license exposes the studio to copyright infringement lawsuits; generative models can memorize and reproduce distinctive stylistic elements or trademarked brand assets (substantial similarity) in commercial client outputs, violating IP indemnity clauses in client contracts.",
        "marks": 2
      },
      {
        "point": "(b) Measure 1 - Curated & Licensed Corpora: Restrict fine-tuning datasets strictly to public domain, Creative Commons with commercial permissions, or commercially licensed art assets with clean chain-of-title and artist opt-in agreements.",
        "marks": 1
      },
      {
        "point": "(b) Measure 2 - Content Provenance & Bias Auditing: Embed cryptographic provenance watermarks (such as C2PA standards) in generated deliverables to maintain transparency, while conducting demographic audit checks on training data distributions to prevent discriminatory or stereotypical visual representations in client ads.",
        "marks": 1
      }
    ],
    "examinerTip": "Use precise industry terminology: chain-of-title, substantial similarity, model memorization, and C2PA provenance standards."
  },
  {
    "id": "q-cs-2027-3",
    "theme": "CaseStudy",
    "unit": "CS",
    "unitName": "2027 Case Study: Generative AI for Image Creation",
    "subtopicCode": "CS.2",
    "subtopicName": "GAN Training Stability & Mode Collapse (HL Only)",
    "level": "HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B Extended",
    "skill": "Analysis/Explanation",
    "marks": 6,
    "origin": "2027 Pre-Seen Case Study (Visionary Studios)",
    "prompt": "Visionary Studios machine learning team is experimenting with Generative Adversarial Networks (GANs) to generate rapid photorealistic textures for concept art backgrounds.\n\n(a) Describe the adversarial zero-sum dynamic between the Generator and the Discriminator during GAN training. [2 marks]\n\n(b) Explain the phenomenon of mode collapse in GANs, citing how it would negatively impact Visionary Studios advertising campaigns. [2 marks]\n\n(c) Outline two mathematical or architectural strategies used to stabilize GAN training and mitigate mode collapse. [2 marks]",
    "hint": "Focus on the minimax objective, latent-to-data mapping, diversity reduction, and Wasserstein loss with gradient penalty (WGAN-GP).",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Adversarial Dynamic: The Generator maps a d-dimensional noise vector z to synthetic images G(z) aiming to minimize log(1 - D(G(z))) to deceive the Discriminator. Simultaneously, the Discriminator is trained to maximize log D(x) + log(1 - D(G(z))), classifying real images x as 1 and fake images G(z) as 0 in a two-player zero-sum minimax optimization.",
        "marks": 2
      },
      {
        "point": "(b) Mode Collapse: Mode collapse occurs when the Generator learns to output only a narrow subset of realistic images that consistently trick the Discriminator, rather than learning the full distribution. For Visionary Studios, this results in repetitive, non-diverse concept art (e.g. generating only one car model or one face type across all prompts), failing client creative briefs.",
        "marks": 2
      },
      {
        "point": "(c) Strategy 1 - Wasserstein GAN with Gradient Penalty (WGAN-GP): Replaces standard Jensen-Shannon divergence with Earth Mover's Distance (Wasserstein metric) and enforces 1-Lipschitz continuity via gradient penalty, eliminating vanishing gradients and ensuring continuous informative gradient feedback.",
        "marks": 1
      },
      {
        "point": "(c) Strategy 2 - Minibatch Discrimination / Feature Matching: Equips the Discriminator with information across all samples in a batch to detect lack of diversity, penalizing the Generator if sample variance collapses.",
        "marks": 1
      }
    ],
    "examinerTip": "Higher Level Section B questions require exact understanding of why the Discriminator overpowering the Generator causes vanishing gradients, and how Earth Mover's Distance solves it."
  },
  {
    "id": "q-cs-2027-4",
    "theme": "CaseStudy",
    "unit": "CS",
    "unitName": "2027 Case Study: Generative AI for Image Creation",
    "subtopicCode": "CS.2",
    "subtopicName": "Quantitative Model Evaluation: FID vs Inception Score (HL Only)",
    "level": "HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B Extended",
    "skill": "Evaluation/Discussion",
    "marks": 6,
    "origin": "2027 Pre-Seen Case Study (Visionary Studios)",
    "prompt": "Visionary Studios needs a quantitative methodology to benchmark the quality and diversity of images produced by candidate generative models before deploying them into client workflows.\n\n(a) Contrast how the Inception Score (IS) and the Fréchet Inception Distance (FID) evaluate synthetic images. [3 marks]\n\n(b) Explain why Visionary Studios should prioritize FID over IS when benchmarking commercial advertising image generation models. [3 marks]",
    "hint": "Consider reference vs reference-free metrics, conditional entropy vs feature-space Gaussian statistics (mean and covariance), and sensitivity to mode collapse.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Inception Score (IS): Evaluates ONLY generated images using a pre-trained Inception-v3 classifier. It measures fidelity via low conditional entropy (sharp, recognizable objects) and diversity via high marginal entropy across classes. Crucially, IS never compares generated images against real training images.",
        "marks": 1.5
      },
      {
        "point": "(a) Fréchet Inception Distance (FID): Extracts deep feature representations from the penultimate layer of Inception-v3 for BOTH real and generated datasets, fitting multivariate Gaussian distributions (mean mu and covariance matrix Sigma) and computing the Wasserstein-2 / Fréchet distance between them. Lower FID indicates higher fidelity and distribution similarity.",
        "marks": 1.5
      },
      {
        "point": "(b) Reason 1 - Direct Reference Comparison: Unlike IS, FID explicitly checks whether the generated images mirror the statistical distribution of real commercial assets; if a model creates beautiful but unrepresentative images, FID penalizes it.",
        "marks": 1
      },
      {
        "point": "(b) Reason 2 - Mode Collapse Detection: If the model suffers from mode collapse and outputs only one category or style, IS can still report a falsely high score if outputs are sharp, whereas FID immediately detects the covariance collapse (Sigma_g mismatch) and produces a poor score.",
        "marks": 1
      },
      {
        "point": "(b) Reason 3 - Robustness to Artifacts: FID is much more sensitive to subtle perceptual artifacts, noise injection errors, and blur, mirroring human visual perception much better than IS.",
        "marks": 1
      }
    ],
    "examinerTip": "State the scoring direction clearly: higher IS is better, but lower FID is better (0 indicates identical distributions)."
  },
  {
    "id": "q-cs-2027-5",
    "theme": "CaseStudy",
    "unit": "CS",
    "unitName": "2027 Case Study: Generative AI for Image Creation",
    "subtopicCode": "CS.2",
    "subtopicName": "Hybrid Latent Diffusion vs Pixel-Space Evaluation (HL Only)",
    "level": "HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B Extended",
    "skill": "Evaluation/Discussion",
    "marks": 12,
    "origin": "2027 Pre-Seen Case Study (Visionary Studios)",
    "prompt": "Visionary Studios currently relies on pixel-space diffusion models to generate concept art and commercial advertising assets. While the visual fidelity is high, the generation latency (up to 45 seconds per 1024x1024 image) and massive GPU memory footprint on workstation graphics cards bottleneck creative velocity.\n\nThe studio's AI Director proposes adopting a Hybrid Latent Diffusion Model (combining a Variational Autoencoder [VAE] for spatial compression with a latent-space U-Net conditioned via CLIP cross-attention).\n\nEvaluate this proposal for Visionary Studios. In your response, address:\n- Architectural mechanisms (VAE perceptual compression, latent diffusion, and text-conditioning)\n- Computational performance, hardware feasibility, and latency benefits\n- Creative limitations, artifacts, and trade-offs\n- A synthesized strategic recommendation for Visionary Studios' production pipeline. [12 marks]",
    "hint": "Structure your 12-mark answer across: (1) Architecture, (2) Computational advantages, (3) Limitations & failure modes, and (4) Contextualized studio recommendation with two-tiered pipeline.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Architectural Mechanisms (3 marks): VAE Encoder compresses high-dimensional pixel space (H x W x 3) by a factor of 8 (e.g. 64x spatial area reduction) into a compact latent space representation (h x w x c), removing imperceptible high-frequency noise while retaining core semantics. Iterative forward/reverse diffusion is executed exclusively in this compressed latent space via a U-Net. A CLIP text encoder converts prompts into text embeddings, which are injected into the U-Net through cross-attention layers to steer generation. Finally, the VAE Decoder reconstructs the high-resolution pixel image from the denoised latent vector.",
        "marks": 3
      },
      {
        "point": "Computational & Hardware Feasibility (3 marks): Performing denoising in latent space reduces the tensor dimension processed by each attention and convolutional layer by roughly 64-fold, leading to dramatic reductions in floating-point operations (FLOPs) and VRAM usage. This slashes inference latency from ~45s down to 2-4s, enabling designers to execute iterative prompt prototyping locally on standard high-end studio workstations without constantly renting high-cost cloud clusters.",
        "marks": 3
      },
      {
        "point": "Limitations & Creative Trade-offs (3 marks): The VAE compression is lossy; high-frequency fine details (e.g. legible typography, micro-textures, intricate hands and eyes) can suffer from blur or latent reconstruction distortions. Cross-attention conditioning can suffer from prompt leakage (attribute binding errors where adjectives attach to the wrong nouns). Additionally, a multi-stage pipeline introduces compound failure points where a defect in the VAE decoder ruins an otherwise pristine latent generation.",
        "marks": 3
      },
      {
        "point": "Synthesized Strategic Recommendation (3 marks): Visionary Studios should adopt the Hybrid Latent Diffusion model as their primary tier for creative ideation, client concept boards, and rapid iterative exploration. To resolve the high-frequency detail limitations on final client deliverables, the studio should implement a two-tiered pipeline: fast latent diffusion for drafting, followed by a selective high-resolution upscaling pass (using pixel-space refinement or a GAN-based super-resolution perceptual enhancer) combined with mandatory C2PA content provenance watermarking.",
        "marks": 3
      }
    ],
    "examinerTip": "In the Paper 1 Section B 12-mark evaluation question, high-scoring responses provide balanced criteria with specific operational solutions (e.g., two-tiered pipeline, C2PA watermarks, FLOPs/VRAM reduction) rather than vague opinions."
  },
  {
    "id": "q-synoptic-a3-a4-1",
    "theme": "A",
    "units": [
      "A3",
      "A4"
    ],
    "unit": "A3, A4",
    "unitName": "Databases & Machine Learning",
    "subtopicCode": "A3.3, A4.2",
    "subtopicName": "SQL Feature Extraction & Machine Learning Preprocessing",
    "level": "HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 6,
    "origin": "IB DP Specimen Synoptic (A3+A4)",
    "prompt": "A national healthcare network maintains normalized relational database tables:\n- Patients(patient_id, age, gender, region_code)\n- Admissions(admission_id, patient_id, admission_date, discharge_date, primary_diagnosis)\n- Vitals(vital_id, admission_id, systolic_bp, diastolic_bp, glucose_level, recorded_timestamp)\n\nThe hospital data science department is deploying a supervised machine learning model (Unit A4) to predict 30-day readmission risk for discharged patients using clinical records stored in the relational database (Unit A3).\n\n(a) Write an SQL query or describe the relational join operations required to extract patient_id, age, average systolic_bp, and total previous admissions count. [2 marks]\n\n(b) Explain two data preprocessing transformations that must be performed on these tabular query results before feeding them into a gradient descent-based machine learning model (such as a neural network or logistic regression). [2 marks]\n\n(c) Evaluate why querying a live normalized OLTP database directly during real-time ML inference can degrade system performance, and explain how a denormalized Feature Store or cache mitigates this issue. [2 marks]",
    "hint": "Consider relational aggregation with GROUP BY and JOINs, feature scaling (e.g. Min-Max normalization or Standardization) vs one-hot encoding, and OLTP database contention vs low-latency key-value feature stores.",
    "codeSnippet": "SELECT \n    p.patient_id, \n    p.age, \n    AVG(v.systolic_bp) AS avg_systolic_bp,\n    COUNT(DISTINCT a.admission_id) AS total_admissions\nFROM Patients p\nJOIN Admissions a ON p.patient_id = a.patient_id\nJOIN Vitals v ON a.admission_id = v.admission_id\nGROUP BY p.patient_id, p.age;",
    "markScheme": [
      {
        "point": "(a) SQL Joins & Aggregation: Accurately joins Patients, Admissions, and Vitals on foreign keys (patient_id, admission_id), groups by patient_id and age, and calculates AVG(v.systolic_bp) and COUNT(DISTINCT a.admission_id) [2 marks].",
        "marks": 2
      },
      {
        "point": "(b) Feature Preprocessing: Explains two essential transformations: (1) Numerical feature scaling (Min-Max normalization or Z-score standardization) to prevent high-magnitude features like blood pressure from dominating gradient updates over age; (2) One-Hot Encoding for categorical features (e.g., gender, region_code) or median/mean imputation for missing vital sensor measurements [2 marks].",
        "marks": 2
      },
      {
        "point": "(c) OLTP Contention vs Feature Store: Direct analytical multi-table JOIN queries on transactional databases cause table/row locks, high CPU load, and unbounded latency (violating real-time SLA). A denormalized online Feature Store (e.g. key-value cache like Redis alongside an offline warehouse) pre-computes feature vectors, providing sub-millisecond point lookups without locking the primary transactional database [2 marks].",
        "marks": 2
      }
    ],
    "examinerTip": "In synoptic Paper 1 Section B questions combining Databases (A3) and Machine Learning (A4), answers must bridge both domains: explain how the relational database schema and SQL queries produce the numerical vector representations necessary for machine learning models.",
    "isSynoptic": true
  },
  {
    "id": "q-synoptic-a1-a2-1",
    "theme": "A",
    "units": [
      "A1",
      "A2"
    ],
    "unit": "A1, A2",
    "unitName": "Hardware & Networks",
    "subtopicCode": "A1.3, A2.3",
    "subtopicName": "CPU Interrupt Handling & Packet Ingestion",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section B",
    "skill": "Recall/Concept",
    "marks": 4,
    "origin": "IB DP Specimen Synoptic (A1+A2)",
    "prompt": "Trace the step-by-step sequence of operations that take place between a computer's hardware (CPU, RAM, System Bus) and the operating system network stack when an incoming packet arrives at the Network Interface Card (NIC) over a Local Area Network (LAN).\n\nIn your response, refer explicitly to:\n- Direct Memory Access (DMA) and the packet buffer in RAM\n- The Interrupt Request (IRQ) line\n- The CPU's context save and Interrupt Service Routine (ISR)\n- The operating system protocol stack handling. [4 marks]",
    "hint": "Trace the flow from physical packet arrival at the NIC, DMA transfer into primary RAM, raising an IRQ, CPU pausing its fetch-execute cycle to execute the ISR, and passing the packet up the OSI/TCP-IP stack.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Packet Ingestion & DMA: The NIC receives frame bits from the physical medium, validates the checksum (CRC), and transfers the packet directly into an allocated kernel ring buffer in RAM via Direct Memory Access (DMA) without loading the CPU [1 mark].",
        "marks": 1
      },
      {
        "point": "Interrupt Signaling: The NIC triggers an Interrupt Request (IRQ) signal along the control bus to notify the CPU that packet data is available in primary memory [1 mark].",
        "marks": 1
      },
      {
        "point": "Context Save & ISR Dispatch: The CPU completes its current machine instruction, pushes register states (Program Counter, Accumulator, Status Register) onto the system stack, and vectors to the Network Driver Interrupt Service Routine (ISR) [1 mark].",
        "marks": 1
      },
      {
        "point": "Protocol Demultiplexing: The ISR clears the hardware interrupt and hands the packet off to the OS network stack, which strips Ethernet, IP, and TCP headers before queuing data for the target application socket [1 mark].",
        "marks": 1
      }
    ],
    "examinerTip": "Clearly trace the distinction between NIC hardware, memory buffer, CPU register saving, and OS protocol stack layers.",
    "isSynoptic": true
  },
  {
    "id": "q-synoptic-b2-b4-1",
    "theme": "B",
    "units": [
      "B2",
      "B4"
    ],
    "unit": "B2, B4",
    "unitName": "Programming & Abstract Data Types",
    "subtopicCode": "B2.4, B4.1",
    "subtopicName": "Queue ADT & Breadth-First Graph Traversal in Python",
    "level": "HL",
    "paper": 2,
    "difficulty": "Hard",
    "format": "Coding/Query",
    "skill": "Code Implementation",
    "marks": 5,
    "origin": "IB DP Specimen Synoptic (B2+B4)",
    "prompt": "In Paper 2, candidates are assessed on combining programming algorithms (Unit B2) with Abstract Data Types (Unit B4).\n\n(a) Write a Python class QueueADT implementing a FIFO queue with enqueue(item), dequeue(), is_empty(), and an optional capacity limit. [2 marks]\n\n(b) Using your QueueADT class, write a Python function bfs_traversal(graph, start_node) that performs a Breadth-First Search on a graph represented as an adjacency dictionary (e.g. {'A': ['B', 'C'], 'B': ['D'], ...}) and returns the list of visited nodes in traversal order. [3 marks]",
    "hint": "BFS uses a Queue to explore neighbor nodes level-by-level, while maintaining a set of visited nodes to prevent cycles.",
    "codeSnippet": "class QueueADT:\n    def __init__(self, capacity=50):\n        self._items = []\n        self._capacity = capacity\n    def is_empty(self):\n        return len(self._items) == 0\n    def enqueue(self, item):\n        if len(self._items) >= self._capacity:\n            raise OverflowError(\"Queue is full\")\n        self._items.append(item)\n    def dequeue(self):\n        if self.is_empty():\n            raise IndexError(\"Queue is empty\")\n        return self._items.pop(0)\n\ndef bfs_traversal(graph, start_node):\n    visited = []\n    queue = QueueADT()\n    queue.enqueue(start_node)\n    visited.append(start_node)\n    \n    while not queue.is_empty():\n        current = queue.dequeue()\n        for neighbor in graph.get(current, []):\n            if neighbor not in visited:\n                visited.append(neighbor)\n                queue.enqueue(neighbor)\n    return visited",
    "markScheme": [
      {
        "point": "QueueADT implementation: Correct FIFO logic with enqueue appending to end and dequeue popping from index 0 (or front pointer), including empty check [2 marks].",
        "marks": 2
      },
      {
        "point": "BFS Traversal Initialization: Correctly initializes QueueADT and visited list/set with start_node [1 mark].",
        "marks": 1
      },
      {
        "point": "BFS Loop & Level Traversal: Loops while queue is not empty, dequeues current node, iterates through graph neighbors, enqueuing unvisited neighbors and marking them visited [2 marks].",
        "marks": 2
      }
    ],
    "examinerTip": "Ensure you use the methods of your QueueADT rather than raw list indexing inside bfs_traversal to adhere to ADT encapsulation principles.",
    "isSynoptic": true
  }
];
