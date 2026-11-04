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
  },
  {
    "id": "q-a4-01",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.1",
    "subtopicName": "Machine learning fundamentals",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section B",
    "skill": "Analysis/Design",
    "marks": 5,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "An autonomous vehicle system uses machine learning for object detection and path planning in real-time driving scenarios.\n\n(a) Distinguish between supervised learning and unsupervised learning for training the vehicle's object detection system. [3]\n\n(b) The object detection model is trained on a large dataset of driving images. Outline one reason a graphics processing unit (GPU) is used rather than a central processing unit (CPU) to train this model. [2]",
    "hint": "Focus on labeled ground-truth bounding boxes versus unguided clustering, and contrast GPU massively parallel SIMD execution against sequential CPU pipelines.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Supervised learning relies on labeled training pairs (e.g., camera images tagged with exact bounding boxes and category labels such as 'pedestrian' or 'cyclist') so the model minimises classification/localization error against ground truth.",
        "marks": 2
      },
      {
        "point": "(a) Unsupervised learning processes unlabeled visual or sensor data without explicit ground-truth targets, seeking natural clusters, anomalies, or underlying representations (e.g., detecting novel road obstacles without prior training classes).",
        "marks": 1
      },
      {
        "point": "(b) Training deep convolutional neural networks involves billions of simultaneous matrix multiplications and gradient updates; GPUs feature thousands of high-throughput compute cores operating in parallel (SIMD/tensor architecture), significantly accelerating training time compared to low-core sequential CPUs.",
        "marks": 2
      }
    ],
    "examinerTip": "Avoid vague claims like 'GPUs are faster'. Specifically emphasize the thousands of parallel execution cores performing matrix multiplications concurrently."
  },
  {
    "id": "q-a4-02",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.1",
    "subtopicName": "Machine learning fundamentals",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section A",
    "skill": "Analysis/Design",
    "marks": 4,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A ride-sharing platform uses machine learning for dynamic pricing, driver matching, and route optimization while facing scrutiny over algorithmic fairness and labor practices.\n\n(a) Describe how supervised learning could be used to reduce passenger wait times, and how reinforcement learning could be used to improve route choices. [4]",
    "hint": "Map historical labeled trip records to supervised regression/prediction, and frame vehicle navigation as an agent taking actions in an environment to maximize rewards.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Supervised Learning: Trained on historical labeled datasets of pickup requests, time of day, weather, and traffic conditions to accurately predict passenger demand in specific zones, allowing drivers to be prepositioned ahead of time to minimize pickup delays.",
        "marks": 2
      },
      {
        "point": "Reinforcement Learning: An agent (the routing system) navigates dynamic road conditions, choosing sequential navigation actions (turns/detours) to maximize a cumulative reward function (e.g., lowest transit duration, minimal fuel/traffic delay) based on environmental feedback.",
        "marks": 2
      }
    ],
    "examinerTip": "Clearly contrast the historical static labels of supervised learning with the iterative action-reward feedback loop of reinforcement learning."
  },
  {
    "id": "q-a4-03",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 5,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A company states that its machine learning system is fair because it treats every applicant identically. Discuss this claim. [5]",
    "hint": "Address equality of treatment vs equity of impact, historical training biases, and proxy variables that systematically disadvantage marginalized demographics.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Identical treatment (procedural fairness) does not guarantee fair outcomes (disparate impact) because algorithms reflect and amplify societal inequalities embedded in historical training datasets.",
        "marks": 2
      },
      {
        "point": "Proxy variables (such as postal code, university attended, or employment gaps) closely correlate with protected characteristics (socioeconomic status, ethnicity, gender), indirectly discriminating against groups even when explicit sensitive attributes are removed.",
        "marks": 2
      },
      {
        "point": "True algorithmic fairness requires outcome evaluation, counterfactual fairness testing, debiasing techniques, and ongoing human oversight rather than blind uniform rule application.",
        "marks": 1
      }
    ],
    "examinerTip": "In IB evaluations, balance the theoretical justification of mathematical neutrality against real-world systemic bias and proxy correlation."
  },
  {
    "id": "q-a4-04",
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
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) Identify two real-world applications of machine learning. [2]",
    "hint": "Select distinct domains such as healthcare imaging, automated spam filtering, speech synthesis, recommendation engines, or fraud detection.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Medical diagnosis / computer vision (e.g., detecting malignant tumors or retinopathy in MRI/X-ray scans).",
        "marks": 1
      },
      {
        "point": "Email spam filtering / natural language processing (e.g., classifying messages as spam vs. ham based on text token weights).",
        "marks": 1
      }
    ],
    "examinerTip": "Provide specific, concrete applications rather than broad labels like 'technology' or 'science'."
  },
  {
    "id": "q-a4-05",
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
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) During an election, thousands of varied false articles appear within a single day. Outline why misinformation generated by machine learning is harder to counter than misinformation written by people. [3]",
    "hint": "Analyze automated velocity, stylistic diversity, synthetic personalization, and evasion of static keyword filters.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Scale and velocity: Generative AI models can produce thousands of unique, syntactically coherent variations within seconds, overwhelming manual human fact-checking capacity.",
        "marks": 1
      },
      {
        "point": "Stylistic diversity and evasion: Because machine learning rephrases arguments dynamically, automated content moderation cannot rely on simple string or hash blacklists.",
        "marks": 1
      },
      {
        "point": "Hyper-personalized persuasion: ML models can tailor micro-targeted disinformation to exploit specific demographic anxieties identified across social graph metrics.",
        "marks": 1
      }
    ],
    "examinerTip": "Structure your answer around scale, dynamic variance, and micro-targeting to achieve full marks."
  },
  {
    "id": "q-a4-06",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Easy",
    "format": "Section A",
    "skill": "Recall/Concept",
    "marks": 2,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A regulator asks a company to demonstrate that its model does not disadvantage any group.\n\n(a) Outline what is meant by algorithmic fairness. [2]",
    "hint": "Consider statistical parity, absence of systematic bias against protected groups, and equal opportunity in model outcomes.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Algorithmic fairness refers to designing and validating machine learning models to ensure that decisions do not exhibit systematic prejudice or disparate impact against individuals based on protected traits (e.g., race, gender, religion, age).",
        "marks": 1
      },
      {
        "point": "It requires parity in performance metrics (such as false positive/false negative rates or predictive accuracy) across all demographic sub-populations.",
        "marks": 1
      }
    ],
    "examinerTip": "Highlight both the moral/legal objective and the mathematical criterion (equal error rates across sub-populations)."
  },
  {
    "id": "q-a4-07",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 4,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A technology company trains an AI model on a large dataset of customer records, which includes names, addresses and purchase histories collected through its website.\n\n(a) Discuss the ethical concerns that arise from the company training its model on this dataset. [4]",
    "hint": "Evaluate informed consent, purpose limitation, data re-identification risks, and third-party commercial exploitation.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Informed Consent & Purpose Limitation: Customers provided personal data for purchasing/fulfillment, not for training internal AI architectures; using it without explicit secondary consent violates privacy expectations and data protection frameworks (e.g., GDPR).",
        "marks": 2
      },
      {
        "point": "Re-identification & Data Leakage: Trained model weights or memorization attacks can inadvertently expose sensitive personally identifiable information (PII) like residential addresses or niche transaction habits.",
        "marks": 1
      },
      {
        "point": "Behavioral Manipulation: Mining granular customer purchasing profiles allows the company to train predictive nudges and dynamic exploitation algorithms that capitalize on user vulnerabilities.",
        "marks": 1
      }
    ],
    "examinerTip": "Use precise terminology such as 'informed consent', 'purpose specification', and 're-identification risk'."
  },
  {
    "id": "q-a4-08",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 4,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A hospital prepares to let an algorithm prioritise patients for scanning. Explain why an oversight committee is recommended when machine learning is used in healthcare. [4]",
    "hint": "Discuss life-critical liability, validation against clinical clinical bias, patient safety, and ensuring human-in-the-loop overrides.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Accountability and Legal Liability: Autonomous decisions in triage directly affect patient mortality; an oversight committee establishes clear governance chains regarding malpractice, software defects, and clinician responsibility.",
        "marks": 2
      },
      {
        "point": "Validation Against Algorithmic Drift and Subgroup Bias: Committees independently audit the model to detect if prioritization rules systematically disadvantage specific demographic cohorts or exhibit data drift when diagnostic protocols shift.",
        "marks": 1
      },
      {
        "point": "Ensuring Human-in-the-Loop Override: Oversight mandates that algorithmic suggestions remain decision-support tools rather than unquestioned mandates, guaranteeing physicians can override anomalous rankings.",
        "marks": 1
      }
    ],
    "examinerTip": "Healthcare questions require emphasis on patient safety, algorithmic accountability, and clinician override authority."
  },
  {
    "id": "q-a4-09",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.1",
    "subtopicName": "Machine learning fundamentals",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Analysis/Design",
    "marks": 9,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A supermarket chain applies machine learning in three ways: grouping customers by shopping habits, predicting whether an email is promotional or personal, and improving the routes taken by its delivery vans over time.\n\n(a) Identify the type of machine learning used in each of the three cases. [3]\n\n(b) Outline why the customer grouping cannot use supervised learning. [3]\n\n(c) Outline why the van routing improves over time while the email classifier does not. [3]",
    "hint": "Categorize unsupervised clustering, supervised classification, and reinforcement learning. Contrast static training boundaries with active environment feedback.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Grouping customers: Unsupervised learning (clustering).\nPredicting email category: Supervised learning (classification).\nImproving van delivery routes: Reinforcement learning.",
        "marks": 3
      },
      {
        "point": "(b) Supervised learning requires pre-existing labeled output targets for each input instance; in customer segmentation, the retailer has no predefined ground-truth groups or explicit labels, meaning the algorithm must uncover latent clusters autonomously from purchasing attributes.",
        "marks": 3
      },
      {
        "point": "(c) Reinforcement learning continuously updates its policy in response to ongoing environmental trial-and-error rewards (traffic conditions, delivery delays), whereas a standard supervised email classifier operates on fixed weights frozen after training unless manually retrained on newly labeled datasets.",
        "marks": 3
      }
    ],
    "examinerTip": "For 9-mark multi-part questions, ensure each sub-part explicitly references the given scenario context (customers, emails, delivery vans)."
  },
  {
    "id": "q-a4-10",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Easy",
    "format": "Section A",
    "skill": "Recall/Concept",
    "marks": 1,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A clinic introduces software that suggests a diagnosis before the doctor sees the patient. State one reason patients should be told when a machine learning algorithm contributes to their diagnosis. [1]",
    "hint": "Think about medical transparency, patient autonomy, or informed consent.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Upholds patient autonomy and informed consent, allowing patients to understand how their diagnostic assessment was formulated and seek human doctor confirmation.",
        "marks": 1
      }
    ],
    "examinerTip": "Direct state questions require only one clear, unambiguous reason."
  },
  {
    "id": "q-a4-11",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 4,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "Only four organizations worldwide can afford to train models of a given scale.\n\n(a) Explain why the energy cost of training large models raises questions of equity as well as environment. [4]",
    "hint": "Analyze carbon footprint alongside compute disparity between wealthy tech oligopolies and global researchers.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Environmental Impact: Training trillion-parameter foundation models consumes millions of kilowatt-hours and enormous cooling water, contributing substantially to global carbon emissions and resource depletion.",
        "marks": 2
      },
      {
        "point": "Equity & Digital Oligopoly: The exorbitant financial capital required creates an extreme compute divide, monopolizing frontier AI development within a few multinational corporations and excluding academic institutions, non-profits, and the Global South from shaping foundational technologies.",
        "marks": 2
      }
    ],
    "examinerTip": "Do not treat this as purely an environmental question; address both the ecological footprint and the geopolitical/economic equity imbalance."
  },
  {
    "id": "q-a4-12",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 8,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A recruitment company trains a model on ten years of its own hiring decisions. It removes gender and ethnicity from the data before training. Applications from certain groups are still rejected at a much higher rate.\n\n(a) Explain why removing those fields did not prevent the disparity. [4]\n\n(b) Outline why the disparity is harder to detect once the fields have been removed. [2]\n\n(c) Outline what the company should do instead. [2]",
    "hint": "Investigate proxy variables, blind auditing obstacles, and proactive debiasing techniques.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Proxy variables / Latent feature correlation: Other input features (such as school attended, postal code, sports, extracurriculars, or phrasing in resumes) strongly correlate with gender and ethnicity; the model learns to associate these proxies with historical hiring bias embedded in the ten-year training decisions.",
        "marks": 4
      },
      {
        "point": "(b) Without demographic attributes attached to validation predictions, the company cannot easily compute stratified performance metrics (e.g., disparate impact ratio or false rejection rates across sub-populations), masking institutional discrimination under a guise of 'blind' neutrality.",
        "marks": 2
      },
      {
        "point": "(c) Retain sensitive demographic labels exclusively for fairness auditing and algorithmic stress-testing; actively debias historical training labels, retrain on curated balanced datasets, and implement human-in-the-loop review.",
        "marks": 2
      }
    ],
    "examinerTip": "This is a classic algorithmic bias question. Define 'proxy variable' explicitly in part (a)."
  },
  {
    "id": "q-a4-13",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Medium",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 5,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A government proposes using machine learning to identify benefit claims likely to be fraudulent. Discuss this proposal. [5]",
    "hint": "Balance administrative efficiency and taxpayer savings against false accusation risks, systemic bias against vulnerable citizens, and due process/appeal guarantees.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Benefits / Efficiency: Automated pattern recognition can rapidly analyze massive transaction volumes, flag suspicious inconsistencies, reduce bureaucratic processing costs, and safeguard public funds against organized fraud.",
        "marks": 2
      },
      {
        "point": "Risks / Harm: False positives unfairly cut off essential survival stipends for vulnerable families; historical audit data often over-samples marginalized communities, training algorithms that disproportionately suspect the disadvantaged.",
        "marks": 2
      },
      {
        "point": "Governance Conclusion: Automated flagging must require independent human caseworker investigation, robust explainability, and accessible legal appeal mechanisms before benefits are suspended.",
        "marks": 1
      }
    ],
    "examinerTip": "For 'Discuss' command terms, present a balanced appraisal with both benefits and severe ethical hazards before concluding."
  },
  {
    "id": "q-a4-14",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Easy",
    "format": "Section A",
    "skill": "Recall/Concept",
    "marks": 1,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A recruitment model favours applicants resembling those a company has hired before. State the ethical issue this raises. [1]",
    "hint": "Mention perpetuation of historical bias or lack of diversity.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Perpetuation of historical bias / systemic discrimination that reinforces existing workforce homogeneity and excludes qualified diverse candidates.",
        "marks": 1
      }
    ],
    "examinerTip": "State terms like 'historical bias reinforcement' or 'systemic exclusion'."
  },
  {
    "id": "q-a4-15",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Easy",
    "format": "Section A",
    "skill": "Evaluation/Discussion",
    "marks": 2,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A messaging platform ranks, filters and auto-replies to its users' messages. Identify two ethical issues raised by the use of machine learning in online communication. [2]",
    "hint": "Consider privacy/content scanning, algorithmic censorship, communicative authenticity, or behavioral manipulation.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Privacy Violation / Surveillance: The platform must inspect the semantic content of private communications to train models and generate context-aware suggestions.",
        "marks": 1
      },
      {
        "point": "Erosion of Authenticity / Algorithmic Manipulation: Automated filtering and synthetic responses can influence interpersonal relationships, prioritize inflammatory content for engagement, or suppress genuine user expression.",
        "marks": 1
      }
    ],
    "examinerTip": "Give two distinctly different ethical issues (e.g., privacy vs. message manipulation)."
  },
  {
    "id": "q-a4-16",
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
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "Current systems protect data in transit using encryption methods that rely on certain calculations being computationally infeasible.\n\n(a) Outline one security threat that quantum computing poses to systems designed in this way. [2]",
    "hint": "Consider Shor's algorithm breaking asymmetric cryptography like RSA or ECC by solving prime factorization in polynomial time.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Quantum computers utilizing Shor's algorithm can solve discrete logarithm and prime factorization problems in polynomial time.",
        "marks": 1
      },
      {
        "point": "This renders ubiquitous asymmetric public-key cryptography (such as RSA and Diffie-Hellman/ECC) obsolete, enabling adversaries to decrypt captured encrypted communications (harvest now, decrypt later).",
        "marks": 1
      }
    ],
    "examinerTip": "Mention the theoretical basis (prime factorization / discrete logarithms) and the practical consequence (public key encryption failure)."
  },
  {
    "id": "q-a4-17",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 8,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A logistics company automates a warehouse using machine learning, reducing its workforce by 60 per cent while doubling output.\n\n(a) Discuss the societal impact of this change. [5]\n\n(b) Outline why the ethical assessment depends on decisions beyond the technology itself. [3]",
    "hint": "Analyze economic productivity and consumer prices vs worker redundancy, regional unemployment, retraining programs, and safety.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Positive societal impact: Substantially increases operational efficiency, lowers supply chain costs for consumers, reduces human workplace injuries in hazardous manual labor tasks, and creates demand for higher-skilled robotic technician roles.",
        "marks": 2
      },
      {
        "point": "(a) Negative societal impact: Sudden mass layoffs lead to acute financial distress for vulnerable manual laborers, exacerbate regional socioeconomic inequality, and strain social welfare systems if displaced staff cannot transition into knowledge economy roles.",
        "marks": 3
      },
      {
        "point": "(b) The technology itself is neutral automation; ethical validity depends on corporate governance and public policy, such as whether profits fund worker severance and reskilling programs, or if staff are discarded without compensation.",
        "marks": 3
      }
    ],
    "examinerTip": "In part (b), make sure to emphasize that ethical evaluation rests on socioeconomic policy and transition management, not merely the robotics software."
  },
  {
    "id": "q-a4-18",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 8,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "Software capable of generating realistic synthetic video of real people has become widely available.\n\n(a) State two legitimate uses of this technology. [2]\n\n(b) Discuss the ethical implications of its wide availability. [5]\n\n(c) State the ethical principle that the depicted person's agreement relates to. [1]",
    "hint": "Identify valid creative/educational applications, analyze deepfake harm (fraud, defamation, erosion of public trust), and name informed consent.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Film dubbing / multilingual translation with natural lip-syncing; digital avatar creation for interactive educational simulators or assistive technology.",
        "marks": 2
      },
      {
        "point": "(b) Severe risks include identity theft, corporate financial fraud (CEO voice cloning), non-consensual synthetic imagery, political disinformation during elections, and the 'liar's dividend' where bad actors dismiss authentic evidence as synthetic media.",
        "marks": 5
      },
      {
        "point": "(c) Informed consent / bodily and identity autonomy.",
        "marks": 1
      }
    ],
    "examinerTip": "For (c), name 'informed consent' or 'autonomy' explicitly."
  },
  {
    "id": "q-a4-19",
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
    "marks": 1,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A retailer analyses purchase records to find groupings of similar customers, without being told in advance what those groups are. State the type of machine learning being used. [1]",
    "hint": "Learning patterns without pre-labeled targets is...",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Unsupervised learning (clustering).",
        "marks": 1
      }
    ],
    "examinerTip": "Accept 'Unsupervised learning' or 'Clustering'."
  },
  {
    "id": "q-a4-20",
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
    "marks": 4,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A social media platform uses machine learning to decide which posts each user sees. Describe two ethical concerns this raises. [4]",
    "hint": "Analyze algorithmic filter bubbles/echo chambers, engagement-driven radicalization, addiction loops, and surveillance capitalism.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Echo Chambers & Societal Polarization: Recommendation algorithms optimize for user engagement (clicks, watch time), frequently prioritizing sensationalist, divisive, or extremist content, which isolates users into ideological echo chambers.",
        "marks": 2
      },
      {
        "point": "Behavioral Addiction & Mental Health: ML models learn dopamine-triggering feedback loops to maximize session duration, contributing to compulsive usage patterns, anxiety, and depression especially among adolescent cohorts.",
        "marks": 2
      }
    ],
    "examinerTip": "Clearly explain the mechanism (optimizing for watch time/clicks) and its ethical consequence."
  },
  {
    "id": "q-a4-21",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.1",
    "subtopicName": "Machine learning fundamentals",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Analysis/Design",
    "marks": 7,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A smart agriculture system uses machine learning to predict crop yields, detect plant diseases, and optimize irrigation schedules based on sensor data and weather patterns.\n\n(a) The trained model runs on edge devices installed in remote fields, rather than on a cloud-based platform. Describe why edge devices are suitable for this deployment. [3]\n\n(b) Outline one way in which bias in the training data could affect the disease detection model. [2]\n\n(c) Outline one consequence of a false positive and one consequence of a false negative in the disease detection system. [2]",
    "hint": "Evaluate latency, low bandwidth in rural areas, regional dataset bias, and the agricultural impacts of false alarm vs missed blight.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Edge devices process telemetry locally on-site without relying on continuous internet connectivity, overcoming the unreliable cellular/satellite bandwidth common in remote agricultural fields while eliminating cloud transmission latency.",
        "marks": 3
      },
      {
        "point": "(b) If the training dataset predominantly contains crop imagery from temperate climates or specific plant variants, the model will perform poorly (high error rates) when deployed in different soil types, lighting conditions, or regional cultivars.",
        "marks": 2
      },
      {
        "point": "(c) False positive: Healthy crops are mistakenly flagged, causing unnecessary chemical pesticide costs, labor waste, and potential environmental runoff.\nFalse negative: An active crop infestation is overlooked, allowing disease to spread unchecked and destroy harvest yields.",
        "marks": 2
      }
    ],
    "examinerTip": "In part (c), explicitly label both 'False positive' and 'False negative' and link each to an agricultural repercussion."
  },
  {
    "id": "q-a4-22",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 6,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A school district uses a supervised learning algorithm to predict which students are at risk of failing their final examinations. Teachers are encouraged to focus extra support on students flagged by the system.\n\n(a) Identify two ethical concerns that might arise from using this supervised learning algorithm in education. [2]\n\n(b) Explain two measures the school district could take to reduce the risk of harm from labelling while still using the predictions to support students. [4]",
    "hint": "Consider stigmatization, self-fulfilling prophecies, bias in teacher input data, confidential notifications, and strengths-based intervention.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Self-fulfilling prophecy / Stigmatization: Flagging students as 'at-risk' can lower teacher expectations and damage student self-esteem, paradoxically decreasing academic performance.",
        "marks": 1
      },
      {
        "point": "(a) Perpetuation of socioeconomic bias: Historical grading data may reflect institutional inequalities, causing minority or lower-income students to be flagged at disproportionate rates.",
        "marks": 1
      },
      {
        "point": "(b) Confidentiality and Positive Framing: Keep model risk scores private from students and peers, framing support interventions around constructive skill clinics rather than remedial or punitive tracking.",
        "marks": 2
      },
      {
        "point": "(b) Holistic Human Oversight: Require teachers and counselors to review qualitative student progress and personal circumstances before applying interventions, ensuring algorithms never trigger automated academic tracking.",
        "marks": 2
      }
    ],
    "examinerTip": "For (b), provide concrete institutional safeguards rather than vague generalizations like 'be careful'."
  },
  {
    "id": "q-a4-23",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.1",
    "subtopicName": "Machine learning fundamentals",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Easy",
    "format": "Section A",
    "skill": "Analysis/Design",
    "marks": 2,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A vineyard runs one model on sensors among the vines and another on rented remote servers.\n\n(a) Outline what distinguishes an edge device from a cloud-based platform in a machine learning deployment. [2]",
    "hint": "Differentiate physical proximity to data generation, compute power, and network dependence.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Edge Device: Low-power embedded hardware located directly at the site of data collection (e.g., in the vineyard fields) performing localized, real-time inference with minimal latency and without requiring constant network connectivity.",
        "marks": 1
      },
      {
        "point": "Cloud Platform: Scalable remote server clusters with high compute/storage capacity suitable for heavy model training and centralized multi-source analytics, accessible over high-bandwidth internet connections.",
        "marks": 1
      }
    ],
    "examinerTip": "Contrast physical location (on-site vs remote datacenters) and compute scale (constrained inference vs massive elastic training capacity)."
  },
  {
    "id": "q-a4-24",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 6,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A city government deploys a machine learning–based facial recognition system in all major train stations to identify missing persons and wanted criminals. The system stores captured face images for later comparison.\n\n(a) Identify two ethical concerns that might arise from using this facial recognition system. [2]\n\n(b) Outline two measures the city government could implement to reduce these ethical risks. [4]",
    "hint": "Analyze mass surveillance, chill on civil liberties, differential demographic error rates, data retention limits, and independent auditing.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Mass Surveillance & Privacy Intrusion: Citizens moving through public spaces are continuously biometric-scanned without individualized suspicion or consent, creating a chilling effect on freedom of assembly.",
        "marks": 1
      },
      {
        "point": "(a) Demographic Misidentification: Facial recognition models historically exhibit higher false positive rates for women and ethnic minorities, risking unlawful stops and wrongful arrests.",
        "marks": 1
      },
      {
        "point": "(b) Strict Data Retention and Immediate Purging: Automatically delete biometric scans of individuals who do not match the target criminal database immediately upon capture, preventing mass surveillance databases.",
        "marks": 2
      },
      {
        "point": "(b) Mandatory Human Verification & Independent Audits: Require certified human biometric examiners to verify any algorithmic alert before law enforcement intervention, backed by recurring third-party fairness audits.",
        "marks": 2
      }
    ],
    "examinerTip": "Focus on the balance between public safety and civil liberties, backed by data governance policies."
  },
  {
    "id": "q-a4-25",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 9,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A government department deploys a system that predicts which children are at risk of harm, so that social workers can intervene earlier.\n\n(a) State two ethical issues raised. [2]\n\n(b) Explain why the historical training data is a particular concern in this application. [4]\n\n(c) Outline how the department should use the system's output. [3]",
    "hint": "Investigate over-surveillance of impoverished families, biased referral records, decision-support bounds, and caseworker agency.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) False positives leading to traumatizing, unjustified family separations; systemic stigma against economically disadvantaged households.",
        "marks": 2
      },
      {
        "point": "(b) Historical child welfare data predominantly documents poor families who interact more frequently with public health and welfare agencies, creating an over-sampling bias where poverty is conflated with parental neglect, training the model to target underprivileged demographics.",
        "marks": 4
      },
      {
        "point": "(c) The output must serve strictly as an advisory triage flag for allocating preventative family support resources (not automatic punitive action), and every case must be independently evaluated by qualified human social workers.",
        "marks": 3
      }
    ],
    "examinerTip": "In part (b), clearly articulate that public administrative records reflect institutional surveillance bias rather than genuine underlying rates of harm."
  },
  {
    "id": "q-a4-26",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.4",
    "subtopicName": "Ethical considerations",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Evaluation/Discussion",
    "marks": 9,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A bank replaces its loan officers with a model that approves or refuses applications automatically. An applicant refused a loan asks why.\n\n(a) State the ethical principle the applicant is appealing to. [1]\n\n(b) Outline why the bank may be unable to answer. [3]\n\n(c) Discuss whether refusal decisions should be automated at all. [5]",
    "hint": "Reference the right to explanation, deep neural network black box problem, complex non-linear feature interactions, and human recourse.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) The right to explanation / algorithmic transparency.",
        "marks": 1
      },
      {
        "point": "(b) Complex machine learning architectures (such as deep neural networks or ensemble gradient boosters) function as opaque 'black boxes' where millions of non-linear parameter weights make it mathematically intractable to isolate the precise causal factor behind a single prediction.",
        "marks": 3
      },
      {
        "point": "(c) Arguments for automation: Consistent application of credit scoring, high processing speed, reduction of human loan officer interpersonal prejudice.\nArguments against automation: Lack of contextual empathy for atypical financial hardships, inability to contest opaque mistakes, systemic exclusion of gig-economy workers.\nConclusion: Refusals carry major financial life consequences and should require human review and clear actionable counterfactual explanations.",
        "marks": 5
      }
    ],
    "examinerTip": "Use the term 'black box problem' and explain non-linear feature weights when discussing why explanations cannot be provided."
  },
  {
    "id": "q-a4-27",
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
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A fraud model rejects a transaction and no one can determine which factors caused it. Outline why a model that cannot explain its decisions is described as a security as well as an ethical concern. [3]",
    "hint": "Analyze debuggability, vulnerability to adversarial evasion attacks, and lack of customer recourse.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Ethical Concern: Denies legitimate customers transparency and due process when their rightful assets are frozen without verifiable justification.",
        "marks": 1
      },
      {
        "point": "Security Concern - Adversarial Blindspots: If engineers cannot explain how the model reaches decisions, they cannot detect whether malicious actors are craftily exploiting edge-case blind spots (adversarial perturbations) to bypass fraud filters.",
        "marks": 1
      },
      {
        "point": "Auditability & Maintenance: Prevents cybersecurity auditors from debugging model failures, testing edge cases, or validating that security compliance standards are met.",
        "marks": 1
      }
    ],
    "examinerTip": "Ensure you address both the 'security' dimension (adversarial attacks/auditability) and the 'ethical' dimension (recourse/fairness)."
  },
  {
    "id": "q-a4-28",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.1",
    "subtopicName": "Machine learning fundamentals",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Easy",
    "format": "Section A",
    "skill": "Analysis/Design",
    "marks": 2,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A hospital uses a supervised learning algorithm for diagnosis. Identify two factors that might determine the need for an increase in processing power. [2]",
    "hint": "Consider dataset volume/resolution, model architecture complexity, or real-time inference latency requirements.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Dataset scale and input dimensionality (e.g., transitioning from low-res 2D X-rays to high-resolution 3D volumetric MRI/CT scans with millions of voxels).",
        "marks": 1
      },
      {
        "point": "Model architecture depth / latency constraints (e.g., increasing neural network layers and parameter count to achieve higher diagnostic accuracy under strict real-time emergency triage deadlines).",
        "marks": 1
      }
    ],
    "examinerTip": "Mention concrete factors like input dimensionality or model parameter depth."
  },
  {
    "id": "q-a4-29",
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
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "(a) A voice assistant converts speech to text and then determines what the speaker is asking for. Outline the branch of machine learning involved. [2]",
    "hint": "Think of Natural Language Processing (NLP), speech recognition, and intent classification.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Natural Language Processing (NLP) / Automated Speech Recognition (ASR).",
        "marks": 1
      },
      {
        "point": "Converts acoustic audio waveform features into textual phonetic representations and applies semantic parsing / intent classification models to understand syntactic meaning and extract user command parameters.",
        "marks": 1
      }
    ],
    "examinerTip": "Name Natural Language Processing (NLP) and explain both speech-to-text tokenization and semantic intent extraction."
  },
  {
    "id": "q-a4-30",
    "theme": "A",
    "unit": "A4",
    "unitName": "Machine Learning",
    "subtopicCode": "A4.1",
    "subtopicName": "Machine learning fundamentals",
    "level": "SL/HL",
    "paper": 1,
    "difficulty": "Hard",
    "format": "Section B",
    "skill": "Analysis/Design",
    "marks": 11,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A supermarket chain wants to improve operations using machine learning (ML). It plans two features:\n- grouping customers based on purchase behaviour to design targeted promotions\n- using an in-store camera system to detect when shelves are running low (near real-time)\n\n(a) Outline one key characteristic of each of the following approaches:\n- supervised learning\n- unsupervised learning\n- reinforcement learning [3]\n\n(b) Describe how unsupervised learning could be used to group customers based on their shopping behaviour. [4]\n\n(c) Explain two differences in hardware requirements between deploying the shelf-monitoring model on an edge device in the store and deploying it on a cloud-based platform. [4]",
    "hint": "Outline the three core paradigms, detail clustering algorithms (k-means/hierarchical) with transaction vectors, and contrast local edge GPU/accelerator power and bandwidth with centralized cloud instances.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "(a) Supervised Learning: Trained using paired input data and explicit ground-truth labels to minimize prediction loss.\nUnsupervised Learning: Analyzes unlabeled data to detect latent patterns, distributions, or groupings without predefined target outputs.\nReinforcement Learning: An agent iteratively learns an optimal policy through exploratory actions, receiving feedback via scalar rewards and penalties from an environment.",
        "marks": 3
      },
      {
        "point": "(b) Feature extraction: Customer transactions are transformed into numerical vectors (e.g., spend amount, visit frequency, categories purchased).\nClustering: An algorithm (e.g., k-means) computes geometric distances between customer data points in multi-dimensional feature space, grouping customers with similar buying patterns together so customized marketing incentives can be directed to each cluster.",
        "marks": 4
      },
      {
        "point": "(c) Edge Deployment: Requires dedicated on-premise hardware accelerators (e.g., low-power tensor processing chips, local GPUs) installed in-store to handle real-time multi-camera video frame inferencing locally without saturating external network bandwidth.\nCloud Deployment: The store requires high-bandwidth upload network hardware and switches to continuously stream multi-camera video feeds, while the computation runs on elastic, high-memory virtualized cloud server clusters with centralized maintenance.",
        "marks": 4
      }
    ],
    "examinerTip": "In part (b), mention feature vectors and geometric distance/clustering in multi-dimensional space to secure top-band marks."
  },
  {
    "id": "q-a4-31",
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
    "marks": 4,
    "origin": "RevisionDojo Practice (A4.1/A4.4)",
    "prompt": "A university uses online proctoring software that records students through their webcams while they sit exams at home. A machine learning model flags any behaviour it considers suspicious.\n\n(a) Outline two ethical concerns. [4]",
    "hint": "Analyze privacy invasion of domestic environments, neurodivergent movement flagging, racial disparity in lighting/facial tracking, and presumption of guilt.",
    "codeSnippet": null,
    "markScheme": [
      {
        "point": "Invasive Surveillance & Domestic Privacy: Continuous webcam monitoring and audio capture intrude into students' private home environments, forcing them to expose domestic living conditions and family members.",
        "marks": 2
      },
      {
        "point": "Algorithmic Inequity & Neurodivergent Bias: Facial tracking models struggle with non-ideal domestic lighting or darker skin tones, and frequently misinterpret normative fidgeting, looking away, or reading aloud (common among neurodivergent students) as cheating, causing intense psychological stress and false disciplinary accusations.",
        "marks": 2
      }
    ],
    "examinerTip": "Clearly outline the ethical concerns with specific attention to technical biases (lighting/skin tone tracking) and domestic privacy."
  }
];
