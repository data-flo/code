/* eslint no-plusplus: 0, no-bitwise: 0, no-undef: 0 */

function uuid() {
  // new method to generated uuid, much better -> https://goo.gl/82GDUJ
  let d = new Date().getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    // console.log(performance.now());
    d += performance.now(); // use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  }).replace(/-/g, "");
}

function random(prefix, moreEntropy) {
  if (typeof prefix === "undefined") {
    prefix = "";
  }

  let retId;
  const formatSeed = function (seed, reqWidth) {
    seed = parseInt(seed, 10)
      .toString(16); // to hex str
    if (reqWidth < seed.length) {
      // so long we split
      return seed.slice(seed.length - reqWidth);
    }
    if (reqWidth > seed.length) {
      // so short we pad
      return Array(1 + (reqWidth - seed.length))
        .join("0") + seed;
    }
    return seed;
  };

  // BEGIN REDUNDANT
  if (!this.php_js) {
    this.php_js = {};
  }
  // END REDUNDANT
  if (!this.php_js.uniqidSeed) {
    // init seed with big random int
    this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
  }
  this.php_js.uniqidSeed++;

  // start with prefix, add current milliseconds hex string
  retId = prefix;
  retId += formatSeed(parseInt(new Date()
    .getTime() / 1000, 10), 8);
  // add seed hex string
  retId += formatSeed(this.php_js.uniqidSeed, 5);
  if (moreEntropy) {
    // for more entropy we add a float lower to 10
    retId += (Math.random() * 10)
      .toFixed(8)
      .toString();
  }

  return retId;
}

function generateId(prefix) {
  if (prefix) {
    return `${prefix}_${random()}`;
  } else {
    return random();
  }
}

function createEpicollectQuestion(parentRef, questionDef) {
  const questionRef = generateId(parentRef);
  const item = {
    ref: questionRef,
    type: questionDef.type || "group",
    question: questionDef.title,
    is_title: false,
    is_required: questionDef.required || false,
    uniqueness: "none",
    regex: null,
    default: "",
    verify: false,
    max: "",
    min: "",
    datetime_format: null,
    set_to_current_datetime: false,
    possible_answers: (questionDef.answers || []).map((answer) => ({ answer, answer_ref: generateId() })),
    jumps: [],
    branch: [],
    group: [],
  };
  if (Array.isArray(questionDef.questions)) {
    for (const subQuestionDef of questionDef.questions) {
      const subitem = createEpicollectQuestion(questionRef, subQuestionDef);
      item.group.push(subitem);
    }
  }
  return item;
}

function createEpicollectForm(groups) {
  const formId = generateId(uuid());
  const form = {
    id: formId,
    type: "form",
    form: {
      ref: formId,
      name: "Whonet",
      slug: "whonet",
      type: "hierarchy",
      inputs: [],
    },
  };
  for (const questionDef of groups) {
    const input = createEpicollectQuestion(form.id, questionDef);
    form.form.inputs.push(input);
  }
  return { data: form };
}

function dropdownOptions(list) {
  return (
    list.rows
      .map((item) => `${item.code} - ${item.name}`)
      .sort()
  );
}

async function getSpcliste(laboratoryType, data) {
  const typeFieldName = laboratoryType.toUpperCase();
  const list = [];
  for (const row of data.rows) {
    if (row[typeFieldName] === "X") {
      list.push(`${row.C_ENGLISH} - ${row.ENGLISH}`);
    }
  }
  return list.sort();
}

async function getOrganismList(data) {
  const list = [];
  for (const row of data.rows) {
    if (row.COMMON === "X") {
      list.push(`${row.ORG} - ${row.ORGANISM}`);
    }
  }
  return list.sort();
}

module.exports = async function (args) {
  const form = [
    {
      title: "Origin",
      questions: [
        {
          type: "text",
          title: "Identification number",
          required: true,
        },
        {
          type: "text",
          title: "First name",
        },
        {
          type: "text",
          title: "Middle name",
        },
        {
          type: "text",
          title: "Last name",
        },
        {
          type: "dropdown",
          title: "Sex",
          answers: [
            "f - Female",
            "m - Male",
          ],
        },
        {
          type: "text",
          title: "Age",
        },
        {
          type: "date",
          title: "Date of birth",
        },
        {
          type: "dropdown",
          title: "Age category",
          answers: [
            "new - Newborn",
            "ped - Pediatric",
            "adu - Adult",
            "ger - Geriatric",
            "unk - Unknown",
            "oth - Other",
          ],
        },
        {
          type: "date",
          title: "Date of admission",
        },
        {
          type: "text",
          title: "Nosocomial infection",
        },
        {
          type: "text",
          title: "Diagnosis",
        },
      ],
    },
    {
      title: "Location",
      questions: [
        {
          type: "dropdown",
          title: "Location",
          answers: dropdownOptions(args.wards),
        },
        {
          type: "dropdown",
          title: "Institution",
          answers: dropdownOptions(args.institutions),
        },
        {
          type: "dropdown",
          title: "Department",
          answers: dropdownOptions(args.departments),
        },
        {
          type: "dropdown",
          title: "Location type",
          answers: [
            "out - Outpatient",
            "in  - Inpatient",
            "inx - Inpatient (non-ICU)",
            "icu - Intensive care unit",
            "int - Intermediate care unit",
            "eme - Emergency",
            "nur - Nursing home",
            "com - Community",
            "lab - Laboratory",
            "unk - Unknown",
            "mix - Mixed",
            "oth - Other",
          ],
        },
      ],
    },
    {
      title: "Specimen",
      questions: [
        {
          type: "text",
          title: "Specimen number",
        },
        {
          type: "date",
          title: "Specimen date",
        },
        {
          type: "dropdown",
          title: "Specimen type",
          answers: await getSpcliste(args.laboratoryType, args.specimenTypes),
        },
      ],
    },
    {
      title: "Microbiology",
      questions: [
        {
          type: "dropdown",
          title: "Organism",
          answers: await getOrganismList(args.organisms),
          required: true,
        },
        {
          type: "dropdown",
          title: "Beta-lactamse",
          answers: [
            "+  Positive",
            "-  Negative",
          ],
        },
        {
          type: "dropdown",
          title: "MRSA",
          answers: [
            "+  Positive",
            "-  Negative",
          ],
        },
        {
          type: "dropdown",
          title: "ESBL",
          answers: [
            "+  Positive",
            "-  Negative",
          ],
        },
        {
          type: "text",
          title: "Urine colony count",
        },
        {
          type: "dropdown",
          title: "Serotype",
          answers: [
            "...",
          ],
        },
        {
          type: "dropdown",
          title: "Carbapenemase",
          answers: [
            "+  Positive",
            "-  Negative",
          ],
        },
        {
          type: "dropdown",
          title: "Inducible clindamycin resistance",
          answers: [
            "+  Positive",
            "-  Negative",
          ],
        },
      ],
    },
    {
      type: "radio",
      title: "Antibiotic panel",
      answers: [
        "Disk",
        "MIC",
      ],
    },
    {
      type: "group",
      title: "Disk",
      questions: (
        args.antibiotics.rows
          .filter((x) => x.test === "Disk")
          .map(({ code, name }) =>
            ({
              title: `${code} - ${name}`,
              type: "integer",
            })
          )
      ),
    },
    {
      type: "group",
      title: "MIC",
      questions: (
        args.antibiotics.rows
          .filter((x) => x.test === "MIC")
          .map(({ code, name }) =>
            ({
              title: `${code} - ${name}`,
              type: "integer",
            })
          )
      ),
    },
    {
      title: "Other",
      questions: [
        {
          type: "textarea",
          title: "Comment",
        },
        {
          type: "text",
          title: "Referral Isolates",
        },
        {
          type: "text",
          title: "Record Numner",
        },
        {
          type: "text",
          title: "ICR",
        },
        {
          type: "text",
          title: "MECA",
        },
        {
          type: "text",
          title: "AMPC",
        },
        {
          type: "text",
          title: "MRSE",
        },
        {
          type: "text",
          title: "CARB",
        },
        {
          type: "text",
          title: "Stock Number",
        },
        {
          type: "text",
          title: "MBL",
        },
      ],
    },
  ];

  const epicollectForm = createEpicollectForm(form);

  // Add jumps
  const antibioticPanelQuestion = epicollectForm.data.form.inputs.find((x) => x.question === "Antibiotic panel");
  for (const item of antibioticPanelQuestion.possible_answers) {
    const group = epicollectForm.data.form.inputs.find((x) => x.type === "group" && x.question === item.answer);
    if (epicollectForm.data.form.inputs.indexOf(group) > epicollectForm.data.form.inputs.indexOf(antibioticPanelQuestion) + 1) {
      antibioticPanelQuestion.jumps.push({
        answer_ref: item.answer_ref,
        to: group.ref,
        when: "IS",
      });
    }
  }

  return {
    // form: formJson(groups),
    form: JSON.stringify(epicollectForm, null, 2),
  };
};
