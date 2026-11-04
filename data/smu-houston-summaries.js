/* ===========================================================================
   PLAIN-LANGUAGE SUMMARIES FOR THE EXPLORER
   Written by Houston Arts Alliance. These are HAA's sentences about SMU
   DataArts' figures; the figures themselves stay in smu-houston-profile.js.
   One summary per view and section:
     lead    the finding, in one sentence
     why     why it matters, using only what the report supports
     claims  what the wording asserts, so scripts/check-explorer.js fails if a
             new report makes a sentence untrue

   No figure is typed into a sentence. Each one is a token that reads the data
   file:
     {h:metric}              Houston, this view
     {n:metric}              national benchmark, this view
     {h:metric|component}    one component of a metric
     {h:metric@view}         another view; allowed in "why" only
     {lit:$250k}             a budget label; it must appear in the data file

   Claims are arrays. Operands are "h:..." or "n:..." references, or numbers.
     ["gt",a,b] ["lt",a,b] ["eq",a,b]   a is above, below, or equal to b
     ["near",a,b]                       within 1 of each other ("close to")
     ["top",a,"budget"]                 a is the highest across that mode
     ["widest",metric,"budget"]         this view has the largest Houston-benchmark gap
     ["closest",metric,"discipline"]    this view has the smallest Houston-benchmark gap
   =========================================================================== */
window.SMU_HOUSTON_SUMMARIES = {
  whyLabel: "Why it matters:",
  credit: "Summary by Houston Arts Alliance.",
  captions: {
    organizations: "Each square is one organization.",
    dollars: "Each square is $1 of every $100 in average expenses.",
    share: "Each square is 1 in every 100 organizations.",
    attendance: "Each square is 1,000 in attendance."
  },
  views: {
    "overall": {
      "sector-profile": {
        lead: "Nearly half of these {h:orgs_total} Houston arts organizations spend less than {lit:$250k} a year.",
        why: "A few large organizations pull up the averages on this page. Choose a budget size to compare like with like.",
        claims: [["gt","h:orgs_by_budget_share|under-250k",40],["lt","h:orgs_by_budget_share|under-250k",50]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what these Houston organizations spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "It weighs most at the small end: {h:local_gov_pct_expenses@under-250k} of expenses under {lit:$250k} and {h:local_gov_pct_expenses@250k-1m} at {lit:$250k-$999k}, compared with {h:local_gov_pct_expenses@10m-plus} at {lit:$10M+}.",
        claims: [["gt","h:local_gov_pct_expenses@under-250k","h:local_gov_pct_expenses@10m-plus"],["gt","h:local_gov_pct_expenses@250k-1m","h:local_gov_pct_expenses@10m-plus"]]
      },
      "workforce": {
        lead: "More than half of what these Houston organizations spend goes to people: {h:personnel_pct_expenses}. The national benchmark is {n:personnel_pct_expenses}.",
        why: "Most of an arts budget pays people. That's true at four of the five budget sizes. The exception is {lit:$3M-$9.99M}, at {h:personnel_pct_expenses@3m-10m}.",
        claims: [["gt","h:personnel_pct_expenses",50],["gt","h:personnel_pct_expenses@under-250k",50],["gt","h:personnel_pct_expenses@250k-1m",50],["gt","h:personnel_pct_expenses@1m-3m",50],["gt","h:personnel_pct_expenses@10m-plus",50],["lt","h:personnel_pct_expenses@3m-10m",50]]
      },
      "audience": {
        lead: "These Houston organizations averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "That average hides a wide range, from {h:avg_attendance@under-250k} under {lit:$250k} to {h:avg_attendance@10m-plus} at {lit:$10M+}. Most budget groups here average below it.",
        claims: [["lt","h:avg_attendance@under-250k","h:avg_attendance"],["lt","h:avg_attendance@250k-1m","h:avg_attendance"],["lt","h:avg_attendance@3m-10m","h:avg_attendance"],["gt","h:avg_attendance@10m-plus","h:avg_attendance"]]
      },
      "facilities": {
        lead: "About half of these Houston organizations rent their main space. {h:primary_facility|donated_in_kind} use donated space, and {h:primary_facility|own} own theirs.",
        why: "Most don't own, so their home depends on a lease or a donor. Donated space is more common here than in the national benchmark: {h:primary_facility|donated_in_kind}, compared with {n:primary_facility|donated_in_kind}.",
        claims: [["gt","h:primary_facility|rent",45],["lt","h:primary_facility|rent",55],["lt","h:primary_facility|own",50],["gt","h:primary_facility|donated_in_kind","n:primary_facility|donated_in_kind"]]
      }
    },
    "performing": {
      "sector-profile": {
        lead: "{h:orgs_by_discipline_count|performing} of these {h:orgs_total} Houston organizations are in the performing arts.",
        why: "This slice of the sector is about the same size here as in the national benchmark: {h:orgs_by_discipline_share|performing} of organizations, compared with {n:orgs_by_discipline_share|performing}.",
        claims: [["near","h:orgs_by_discipline_share|performing","n:orgs_by_discipline_share|performing"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston's performing arts organizations spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Individuals and foundations carry more of the load: they give {h:contributed_sources|individuals} and {h:contributed_sources|foundations} of contributed revenue, compared with {h:contributed_sources|local_gov} from local government.",
        claims: [["gt","h:contributed_sources|individuals","h:contributed_sources|local_gov"],["gt","h:contributed_sources|foundations","h:contributed_sources|local_gov"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what Houston's performing arts organizations spend goes to people. The national benchmark is {n:personnel_pct_expenses}.",
        why: "Much of this work is part-time. Part-time staff outnumber full-time on average, {h:avg_pt_staff} to {h:avg_ft_staff}, as they do in the benchmark.",
        claims: [["gt","h:avg_pt_staff","h:avg_ft_staff"],["gt","n:avg_pt_staff","n:avg_ft_staff"]]
      },
      "audience": {
        lead: "Houston's performing arts organizations averaged {h:avg_attendance} in attendance each, close to the {n:avg_attendance} in the national benchmark.",
        why: "It's the closest of the three disciplines to the benchmark.",
        claims: [["near","h:avg_attendance","n:avg_attendance"],["closest","avg_attendance","discipline"]]
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston's performing arts organizations rent their main space, and {h:primary_facility|own} own theirs.",
        why: "Ownership is lower than the {n:primary_facility|own} in the national benchmark, so most of these groups depend on a lease or a donor for a place to work.",
        claims: [["lt","h:primary_facility|own","n:primary_facility|own"],["lt","h:primary_facility|own",50]]
      }
    },
    "visual": {
      "sector-profile": {
        lead: "{h:orgs_by_discipline_count|visual} of these {h:orgs_total} Houston organizations fall under Visual Arts.",
        why: "Read the name broadly. This group includes film, television, publishing, and radio as well as visual arts organizations and art museums.",
        claims: []
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston's Visual Arts organizations spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Foundations play a larger role: they give {h:contributed_sources|foundations} of this group's contributed revenue, compared with {n:contributed_sources|foundations} in the benchmark.",
        claims: [["gt","h:contributed_sources|foundations","n:contributed_sources|foundations"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what Houston's Visual Arts organizations spend goes to people. The national benchmark is {n:personnel_pct_expenses}.",
        why: "This group leans on full-time staff: {h:avg_ft_staff} on average, with {h:avg_pt_staff} part-time.",
        claims: [["gt","h:avg_ft_staff","h:avg_pt_staff"]]
      },
      "audience": {
        lead: "Houston's Visual Arts organizations averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "It's the highest average of the three disciplines, from the smallest group: {h:orgs_by_discipline_count|visual} organizations.",
        claims: [["top","h:avg_attendance","discipline"]]
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston's Visual Arts organizations rent their main space, and {h:primary_facility|own} own theirs.",
        why: "Ownership is lower than the {n:primary_facility|own} in the national benchmark, and donated space is more common: {h:primary_facility|donated_in_kind}, compared with {n:primary_facility|donated_in_kind}.",
        claims: [["lt","h:primary_facility|own","n:primary_facility|own"],["gt","h:primary_facility|donated_in_kind","n:primary_facility|donated_in_kind"]]
      }
    },
    "other": {
      "sector-profile": {
        lead: "More than half of these {h:orgs_total} Houston organizations fall under Other Arts: {h:orgs_by_discipline_count|other} in all.",
        why: "It's the largest group and the hardest to picture from its name. It covers arts education, arts councils, history and humanities groups, and children's, history, and science museums.",
        claims: [["gt","h:orgs_by_discipline_share|other",50]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston's Other Arts organizations spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "That's a larger share than in Performing Arts ({h:local_gov_pct_expenses@performing}) or Visual Arts ({h:local_gov_pct_expenses@visual}), so local funding decisions weigh more heavily here.",
        claims: [["top","h:local_gov_pct_expenses","discipline"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what Houston's Other Arts organizations spend goes to people, close to the {n:personnel_pct_expenses} in the national benchmark.",
        why: "Full-time and part-time staff are about even here, at {h:avg_ft_staff} and {h:avg_pt_staff} on average.",
        claims: [["near","h:personnel_pct_expenses","n:personnel_pct_expenses"],["near","h:avg_ft_staff","h:avg_pt_staff"]]
      },
      "audience": {
        lead: "Houston's Other Arts organizations averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "This group runs from arts education programs to science museums, so its average covers very different kinds of attendance.",
        claims: []
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston's Other Arts organizations rent their main space, and {h:primary_facility|own} own theirs.",
        why: "Ownership is higher here than in the other two disciplines, and it matches the national benchmark.",
        claims: [["top","h:primary_facility|own","discipline"],["eq","h:primary_facility|own","n:primary_facility|own"]]
      }
    },
    "under-250k": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|under-250k} of these {h:orgs_total} Houston organizations spend less than {lit:$250k} a year.",
        why: "More organizations sit here than at any other budget size: {h:orgs_by_budget_share|under-250k} of the Houston group and {n:orgs_by_budget_share|under-250k} of the national benchmark.",
        claims: [["gt","h:orgs_by_budget_count|under-250k","h:orgs_by_budget_count|250k-1m"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations under {lit:$250k} spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "That's more than a tenth of the budget. No single source dominates contributed revenue at this size: individuals give {h:contributed_sources|individuals}, foundations {h:contributed_sources|foundations}, and corporations {h:contributed_sources|corporations}.",
        claims: [["gt","h:local_gov_pct_expenses",10],["lt","h:contributed_sources|individuals",50],["lt","h:contributed_sources|foundations",50]]
      },
      "workforce": {
        lead: "Even under {lit:$250k} a year, {h:personnel_pct_expenses} of what these Houston organizations spend goes to people.",
        why: "A small budget still pays people. That figure includes contracted workers, and these organizations average {h:avg_ft_staff} full-time and {h:avg_pt_staff} part-time staff member.",
        claims: [["gt","h:personnel_pct_expenses",50]]
      },
      "audience": {
        lead: "Houston organizations under {lit:$250k} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "Nearly half of these Houston organizations are this size, so {h:avg_attendance} is closer to what many see than the overall average of {h:avg_attendance@overall}.",
        claims: [["gt","h:orgs_by_budget_share|under-250k",40],["lt","h:orgs_by_budget_share|under-250k",50]]
      },
      "facilities": {
        lead: "{h:primary_facility|donated_in_kind} of Houston organizations under {lit:$250k} use donated space, and {h:primary_facility|own} own theirs.",
        why: "Donated space is more common at this size than at any other, so many of the smallest organizations rely on a donor for a home.",
        claims: [["top","h:primary_facility|donated_in_kind","budget"]]
      }
    },
    "250k-1m": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|250k-1m} of these {h:orgs_total} Houston organizations spend {lit:$250k} to {lit:$999k} a year.",
        why: "This size makes up more of the Houston group than of the national benchmark: {h:orgs_by_budget_share|250k-1m} of organizations, compared with {n:orgs_by_budget_share|250k-1m}.",
        claims: [["gt","h:orgs_by_budget_share|250k-1m","n:orgs_by_budget_share|250k-1m"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations at {lit:$250k-$999k} spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "It's the highest share of any Houston budget size, and the only one above its benchmark.",
        claims: [["top","h:local_gov_pct_expenses","budget"],["gt","h:local_gov_pct_expenses","n:local_gov_pct_expenses"],["lt","h:local_gov_pct_expenses@under-250k","n:local_gov_pct_expenses@under-250k"],["lt","h:local_gov_pct_expenses@1m-3m","n:local_gov_pct_expenses@1m-3m"],["lt","h:local_gov_pct_expenses@3m-10m","n:local_gov_pct_expenses@3m-10m"],["lt","h:local_gov_pct_expenses@10m-plus","n:local_gov_pct_expenses@10m-plus"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what these Houston organizations spend goes to people, the highest share of any budget size.",
        why: "These are small teams: {h:avg_ft_staff} full-time and {h:avg_pt_staff} part-time staff on average.",
        claims: [["top","h:personnel_pct_expenses","budget"]]
      },
      "audience": {
        lead: "Houston organizations at {lit:$250k-$999k} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "That's up from {h:avg_attendance@under-250k} at the next size down, so this step in budget comes with a large step in reach.",
        claims: [["gt","h:avg_attendance","h:avg_attendance@under-250k"]]
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston organizations at {lit:$250k-$999k} rent their main space, and {h:primary_facility|own} own theirs.",
        why: "A lease is the most common arrangement at this size, and ownership is lower than the {n:primary_facility|own} in the national benchmark.",
        claims: [["gt","h:primary_facility|rent","h:primary_facility|own"],["gt","h:primary_facility|rent","h:primary_facility|donated_in_kind"],["lt","h:primary_facility|own","n:primary_facility|own"]]
      }
    },
    "1m-3m": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|1m-3m} of these {h:orgs_total} Houston organizations spend {lit:$1M} to {lit:$2.99M} a year.",
        why: "This size makes up less of the Houston group than of the national benchmark: {h:orgs_by_budget_share|1m-3m} of organizations, compared with {n:orgs_by_budget_share|1m-3m}. It's the widest gap in the size mix.",
        claims: [["lt","h:orgs_by_budget_share|1m-3m","n:orgs_by_budget_share|1m-3m"],["widest","orgs_by_budget_share|1m-3m","budget-mix"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations at {lit:$1M-$2.99M} spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Foundations play a larger role at this size: {h:contributed_sources|foundations} of contributed revenue, compared with {n:contributed_sources|foundations} in the benchmark.",
        claims: [["gt","h:contributed_sources|foundations","n:contributed_sources|foundations"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what these Houston organizations spend goes to people, matching the national benchmark.",
        why: "Much of this work is part-time. Part-time staff outnumber full-time at this size, {h:avg_pt_staff} to {h:avg_ft_staff} on average.",
        claims: [["eq","h:personnel_pct_expenses","n:personnel_pct_expenses"],["gt","h:avg_pt_staff","h:avg_ft_staff"]]
      },
      "audience": {
        lead: "Houston organizations at {lit:$1M-$2.99M} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "Attendance doesn't climb evenly with budget. This group's average is above the next size up, at {h:avg_attendance@3m-10m}.",
        claims: [["gt","h:avg_attendance","h:avg_attendance@3m-10m"]]
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston organizations at {lit:$1M-$2.99M} rent their main space, and {h:primary_facility|own} own theirs.",
        why: "Ownership matches the national benchmark. Renting is more common here, and donated space is less so: {h:primary_facility|donated_in_kind}, compared with {n:primary_facility|donated_in_kind}.",
        claims: [["eq","h:primary_facility|own","n:primary_facility|own"],["gt","h:primary_facility|rent","n:primary_facility|rent"],["lt","h:primary_facility|donated_in_kind","n:primary_facility|donated_in_kind"]]
      }
    },
    "3m-10m": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|3m-10m} of these {h:orgs_total} Houston organizations spend {lit:$3M} to {lit:$9.99M} a year.",
        why: "The share is close to the national benchmark: {h:orgs_by_budget_share|3m-10m} and {n:orgs_by_budget_share|3m-10m}. Read this group's averages as a sketch of a few organizations, not a rule for the size.",
        claims: [["near","h:orgs_by_budget_share|3m-10m","n:orgs_by_budget_share|3m-10m"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations at {lit:$3M-$9.99M} spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Individuals are the largest labeled source of contributed revenue at this size, at {h:contributed_sources|individuals}.",
        claims: [["gt","h:contributed_sources|individuals","h:contributed_sources|foundations"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what these Houston organizations spend goes to people. The national benchmark is {n:personnel_pct_expenses}.",
        why: "That's the widest gap from the benchmark of any budget size, and it rests on {h:orgs_by_budget_count|3m-10m} organizations.",
        claims: [["widest","personnel_pct_expenses","budget"]]
      },
      "audience": {
        lead: "Houston organizations at {lit:$3M-$9.99M} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "That's the widest gap from the benchmark of any budget size, and it rests on {h:orgs_by_budget_count|3m-10m} organizations.",
        claims: [["widest","avg_attendance","budget"]]
      },
      "facilities": {
        lead: "{h:primary_facility|own} of Houston organizations at {lit:$3M-$9.99M} own their main space. The national benchmark is {n:primary_facility|own}.",
        why: "It's the highest ownership share of any budget size. With {h:orgs_by_budget_count|3m-10m} organizations, a few buildings shape this figure.",
        claims: [["top","h:primary_facility|own","budget"]]
      }
    },
    "10m-plus": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|10m-plus} of these {h:orgs_total} Houston organizations spend {lit:$10M} or more a year.",
        why: "They're {h:orgs_by_budget_share|10m-plus} of the group, and they pull up the averages for all of it. Attendance averages {h:avg_attendance@10m-plus} here, compared with {h:avg_attendance@overall} across all organizations.",
        claims: [["gt","h:avg_attendance@10m-plus","h:avg_attendance@overall"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations at {lit:$10M+} spend, close to the {n:local_gov_pct_expenses} in the national benchmark.",
        why: "These organizations rely on earned revenue more than any other budget size: {h:earned_vs_contributed|earned} of revenue.",
        claims: [["near","h:local_gov_pct_expenses","n:local_gov_pct_expenses"],["top","h:earned_vs_contributed|earned","budget"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what these Houston organizations spend goes to people, close to the {n:personnel_pct_expenses} in the national benchmark.",
        why: "These are the largest teams in the group: {h:avg_ft_staff} full-time and {h:avg_pt_staff} part-time staff on average.",
        claims: [["near","h:personnel_pct_expenses","n:personnel_pct_expenses"],["top","h:avg_ft_staff","budget"],["top","h:avg_pt_staff","budget"]]
      },
      "audience": {
        lead: "Houston organizations at {lit:$10M+} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "These {h:orgs_by_budget_count|10m-plus} organizations lift the overall average of {h:avg_attendance@overall} above what most budget groups see.",
        claims: [["gt","h:avg_attendance","h:avg_attendance@overall"],["lt","h:avg_attendance@under-250k","h:avg_attendance@overall"],["lt","h:avg_attendance@250k-1m","h:avg_attendance@overall"],["lt","h:avg_attendance@3m-10m","h:avg_attendance@overall"]]
      },
      "facilities": {
        lead: "{h:primary_facility|own} of Houston organizations at {lit:$10M+} own their main space. The national benchmark is {n:primary_facility|own}.",
        why: "Ownership rises steeply with budget: {h:primary_facility|own@under-250k} under {lit:$250k}, {h:primary_facility|own@1m-3m} at {lit:$1M-$2.99M}, and {h:primary_facility|own} here.",
        claims: [["lt","h:primary_facility|own@under-250k","h:primary_facility|own@1m-3m"],["lt","h:primary_facility|own@1m-3m","h:primary_facility|own"]]
      }
    }
  }
};
