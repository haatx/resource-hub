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
     {lit:$250K}             a budget label; it must appear in the data file

   Claims are arrays. Operands are "h:..." or "n:..." references, or numbers.
     ["gt",a,b] ["lt",a,b] ["eq",a,b]   a is above, below, or equal to b
     ["near",a,b]                       within 1 of each other ("close to")
     ["top",a,"budget"]                 a is the highest across that mode
     ["largest",a]                      a is the largest part of its metric
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
        lead: "Nearly half of these {h:orgs_total} Houston arts organizations spend less than {lit:$250K} a year.",
        why: "A few large organizations push up the averages for this data point. Pick a budget size above to see the numbers in context.",
        claims: [["gt","h:orgs_by_budget_share|under-250k",40],["lt","h:orgs_by_budget_share|under-250k",50]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what these Houston organizations spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Share is higher for smaller organizations: {h:local_gov_pct_expenses@under-250k} under {lit:$250K} and {h:local_gov_pct_expenses@250k-1m} at {lit:$250K-$999K}, compared with {h:local_gov_pct_expenses@10m-plus} at {lit:$10M+}.",
        claims: [["gt","h:local_gov_pct_expenses@under-250k","h:local_gov_pct_expenses@10m-plus"],["gt","h:local_gov_pct_expenses@250k-1m","h:local_gov_pct_expenses@10m-plus"]]
      },
      "workforce": {
        lead: "More than half of what these Houston organizations spend goes to people: {h:personnel_pct_expenses}. The national benchmark is {n:personnel_pct_expenses}.",
        why: "Most of an arts budget pays people, and that's true at four of the five budget sizes. {lit:$3M-$9.99M} is the one exception, a little under half at {h:personnel_pct_expenses@3m-10m}.",
        claims: [["gt","h:personnel_pct_expenses",50],["gt","h:personnel_pct_expenses@under-250k",50],["gt","h:personnel_pct_expenses@250k-1m",50],["gt","h:personnel_pct_expenses@1m-3m",50],["gt","h:personnel_pct_expenses@10m-plus",50],["lt","h:personnel_pct_expenses@3m-10m",50],["gt","h:personnel_pct_expenses@3m-10m",40]]
      },
      "audience": {
        lead: "These Houston organizations averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "Don't read too much into that average. Budget groups run from {h:avg_attendance@under-250k} under {lit:$250K} to {h:avg_attendance@10m-plus} at {lit:$10 million} and up.",
        claims: [["lt","h:avg_attendance@under-250k","h:avg_attendance"],["lt","h:avg_attendance@250k-1m","h:avg_attendance"],["lt","h:avg_attendance@3m-10m","h:avg_attendance"],["gt","h:avg_attendance@10m-plus","h:avg_attendance"]]
      },
      "facilities": {
        lead: "About half of these Houston organizations rent their main space. {h:primary_facility|donated_in_kind} use donated space, and {h:primary_facility|own} own theirs.",
        why: "Most don't own, so their space is leased or comes from donors. Donated space is more common here than nationally: {h:primary_facility|donated_in_kind} vs. {n:primary_facility|donated_in_kind}.",
        claims: [["gt","h:primary_facility|rent",45],["lt","h:primary_facility|rent",55],["lt","h:primary_facility|own",50],["gt","h:primary_facility|donated_in_kind","n:primary_facility|donated_in_kind"]]
      }
    },
    "performing": {
      "sector-profile": {
        lead: "{h:orgs_by_discipline_count|performing} of these {h:orgs_total} Houston organizations are in the performing arts.",
        why: "Performing arts make up about the same share here as they do nationally, {h:orgs_by_discipline_share|performing} of organizations vs. {n:orgs_by_discipline_share|performing}.",
        claims: [["near","h:orgs_by_discipline_share|performing","n:orgs_by_discipline_share|performing"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston's performing arts organizations spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Individuals and foundations do most of the giving: {h:contributed_sources|individuals} and {h:contributed_sources|foundations} of contributed revenue. Local government's share is {h:contributed_sources|local_gov}.",
        claims: [["gt","h:contributed_sources|individuals","h:contributed_sources|local_gov"],["gt","h:contributed_sources|foundations","h:contributed_sources|local_gov"],["gt","h:contributed_sources|individuals",25],["gt","h:contributed_sources|foundations",25]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what Houston's performing arts organizations spend goes to people. The national benchmark is {n:personnel_pct_expenses}.",
        why: "A lot of this work is part-time. Part-timers outnumber full-timers {h:avg_pt_staff} to {h:avg_ft_staff} on average, and it's the same story nationally.",
        claims: [["gt","h:avg_pt_staff","h:avg_ft_staff"],["gt","n:avg_pt_staff","n:avg_ft_staff"]]
      },
      "audience": {
        lead: "Houston's performing arts organizations averaged {h:avg_attendance} in attendance each, close to the {n:avg_attendance} in the national benchmark.",
        why: "No other discipline comes this close to its national number.",
        claims: [["near","h:avg_attendance","n:avg_attendance"],["closest","avg_attendance","discipline"]]
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston's performing arts organizations rent their main space, and {h:primary_facility|own} own theirs.",
        why: "That's below the {n:primary_facility|own} who own their space nationally, so most of these groups count on a lease or a donor for a place to work.",
        claims: [["lt","h:primary_facility|own","n:primary_facility|own"],["lt","h:primary_facility|own",50]]
      }
    },
    "visual": {
      "sector-profile": {
        lead: "{h:orgs_by_discipline_count|visual} of these {h:orgs_total} Houston organizations fall under visual arts.",
        why: "This group's much broader than the name suggests. It covers film, TV, publishing, and radio, plus visual arts organizations and art museums.",
        claims: []
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston's visual arts organizations spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Support from foundations matters a lot more locally. They give {h:contributed_sources|foundations} of this group's contributed revenue, vs. {n:contributed_sources|foundations} nationally.",
        claims: [["gt","h:contributed_sources|foundations","n:contributed_sources|foundations"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what Houston's visual arts organizations spend goes to people. The national benchmark is {n:personnel_pct_expenses}.",
        why: "This group leans on full-time staff, {h:avg_ft_staff} on average, and just {h:avg_pt_staff} part-time.",
        claims: [["gt","h:avg_ft_staff","h:avg_pt_staff"]]
      },
      "audience": {
        lead: "Houston's visual arts organizations averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "It's the highest average of the three disciplines, and it comes from the smallest group, just {h:orgs_by_discipline_count|visual} organizations.",
        claims: [["top","h:avg_attendance","discipline"],["lt","h:orgs_by_discipline_count|visual","h:orgs_by_discipline_count|performing"],["lt","h:orgs_by_discipline_count|visual","h:orgs_by_discipline_count|other"]]
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston's visual arts organizations rent their main space, and {h:primary_facility|own} own theirs.",
        why: "Fewer own here than the {n:primary_facility|own} nationally, and donated space is more common: {h:primary_facility|donated_in_kind} vs. {n:primary_facility|donated_in_kind}.",
        claims: [["lt","h:primary_facility|own","n:primary_facility|own"],["gt","h:primary_facility|donated_in_kind","n:primary_facility|donated_in_kind"]]
      }
    },
    "other": {
      "sector-profile": {
        lead: "More than half of these {h:orgs_total} Houston organizations fall under other arts, {h:orgs_by_discipline_count|other} in all.",
        why: "It's the biggest group and the hardest one to picture from the name. Think arts education, arts councils, history and humanities groups, and children's, history, and science museums.",
        claims: [["gt","h:orgs_by_discipline_share|other",50]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston's other arts organizations spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "That's a bigger share than performing arts ({h:local_gov_pct_expenses@performing}) or visual arts ({h:local_gov_pct_expenses@visual}), so local funding decisions matter more for this group.",
        claims: [["top","h:local_gov_pct_expenses","discipline"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what Houston's other arts organizations spend goes to people, close to the {n:personnel_pct_expenses} in the national benchmark.",
        why: "Full-time and part-time staff are pretty much even here, {h:avg_ft_staff} and {h:avg_pt_staff} on average.",
        claims: [["near","h:personnel_pct_expenses","n:personnel_pct_expenses"],["near","h:avg_ft_staff","h:avg_pt_staff"]]
      },
      "audience": {
        lead: "Houston's other arts organizations averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "This group covers everything from arts education programs to science museums, so that one average lumps together very different kinds of attendance.",
        claims: []
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston's other arts organizations rent their main space, and {h:primary_facility|own} own theirs.",
        why: "That's the highest ownership of the three disciplines, and it matches the national number.",
        claims: [["top","h:primary_facility|own","discipline"],["eq","h:primary_facility|own","n:primary_facility|own"]]
      }
    },
    "under-250k": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|under-250k} of these {h:orgs_total} Houston organizations spend less than {lit:$250K} a year.",
        why: "It's the most common budget size, both here and nationally: {h:orgs_by_budget_share|under-250k} of organizations in Houston, {n:orgs_by_budget_share|under-250k} nationally.",
        claims: [["largest","h:orgs_by_budget_share|under-250k"],["largest","n:orgs_by_budget_share|under-250k"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations under {lit:$250K} spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Local government support matters at this budget size: only {lit:$250K-$999K} has a higher share. Contributed revenue comes from several sources, including individuals ({h:contributed_sources|individuals}), foundations ({h:contributed_sources|foundations}), and corporations ({h:contributed_sources|corporations}).",
        claims: [["gt","h:local_gov_pct_expenses",10],["lt","h:contributed_sources|individuals",50],["lt","h:contributed_sources|foundations",50],["lt","h:local_gov_pct_expenses","h:local_gov_pct_expenses@250k-1m"],["gt","h:local_gov_pct_expenses","h:local_gov_pct_expenses@1m-3m"],["gt","h:local_gov_pct_expenses","h:local_gov_pct_expenses@3m-10m"],["gt","h:local_gov_pct_expenses","h:local_gov_pct_expenses@10m-plus"]]
      },
      "workforce": {
        lead: "Even under {lit:$250K} a year, {h:personnel_pct_expenses} of what these Houston organizations spend goes to people.",
        why: "Even a small budget pays people. That figure includes contractors, and these organizations average just {h:avg_ft_staff} full-time and {h:avg_pt_staff} part-time staffer.",
        claims: [["gt","h:personnel_pct_expenses",50]]
      },
      "audience": {
        lead: "Houston organizations under {lit:$250K} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "Nearly half of these Houston organizations are this size, so {h:avg_attendance} is closer to what many actually see than the overall average of {h:avg_attendance@overall}.",
        claims: [["gt","h:orgs_by_budget_share|under-250k",40],["lt","h:orgs_by_budget_share|under-250k",50]]
      },
      "facilities": {
        lead: "{h:primary_facility|donated_in_kind} of Houston organizations under {lit:$250K} use donated space, and {h:primary_facility|own} own theirs.",
        why: "No other budget size uses donated space this much, so many of the smallest organizations count on a donor for a place to work.",
        claims: [["top","h:primary_facility|donated_in_kind","budget"]]
      }
    },
    "250k-1m": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|250k-1m} of these {h:orgs_total} Houston organizations spend {lit:$250K} to {lit:$999K} a year.",
        why: "This size is a bigger piece of the group here than nationally, {h:orgs_by_budget_share|250k-1m} of organizations vs. {n:orgs_by_budget_share|250k-1m}.",
        claims: [["gt","h:orgs_by_budget_share|250k-1m","n:orgs_by_budget_share|250k-1m"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations at {lit:$250K-$999K} spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "That's the highest share of any Houston budget size, and the only one above its national number.",
        claims: [["top","h:local_gov_pct_expenses","budget"],["gt","h:local_gov_pct_expenses","n:local_gov_pct_expenses"],["lt","h:local_gov_pct_expenses@under-250k","n:local_gov_pct_expenses@under-250k"],["lt","h:local_gov_pct_expenses@1m-3m","n:local_gov_pct_expenses@1m-3m"],["lt","h:local_gov_pct_expenses@3m-10m","n:local_gov_pct_expenses@3m-10m"],["lt","h:local_gov_pct_expenses@10m-plus","n:local_gov_pct_expenses@10m-plus"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what these Houston organizations spend goes to people, the highest share of any budget size.",
        why: "They're small teams, {h:avg_ft_staff} full-time and {h:avg_pt_staff} part-time staff on average.",
        claims: [["top","h:personnel_pct_expenses","budget"]]
      },
      "audience": {
        lead: "Houston organizations at {lit:$250K-$999K} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "Compare that to {h:avg_attendance@under-250k} one budget size down. So this step up in budget comes with a big step up in reach.",
        claims: [["gt","h:avg_attendance","h:avg_attendance@under-250k"]]
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston organizations at {lit:$250K-$999K} rent their main space, and {h:primary_facility|own} own theirs.",
        why: "A lease is the usual setup at this size, and fewer own than the {n:primary_facility|own} nationally.",
        claims: [["gt","h:primary_facility|rent","h:primary_facility|own"],["gt","h:primary_facility|rent","h:primary_facility|donated_in_kind"],["lt","h:primary_facility|own","n:primary_facility|own"],["largest","h:primary_facility|rent"]]
      }
    },
    "1m-3m": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|1m-3m} of these {h:orgs_total} Houston organizations spend {lit:$1M} to {lit:$2.99M} a year.",
        why: "This size is a smaller piece of the group here than nationally, {h:orgs_by_budget_share|1m-3m} of organizations vs. {n:orgs_by_budget_share|1m-3m}. No other size is further off.",
        claims: [["lt","h:orgs_by_budget_share|1m-3m","n:orgs_by_budget_share|1m-3m"],["widest","orgs_by_budget_share|1m-3m","budget-mix"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations at {lit:$1M-$2.99M} spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Foundations matter a lot more at this size: {h:contributed_sources|foundations} of contributed revenue, vs. {n:contributed_sources|foundations} nationally.",
        claims: [["gt","h:contributed_sources|foundations","n:contributed_sources|foundations"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what these Houston organizations spend goes to people, matching the national benchmark.",
        why: "A lot of this work is part-time. At this size, part-timers outnumber full-timers {h:avg_pt_staff} to {h:avg_ft_staff} on average.",
        claims: [["eq","h:personnel_pct_expenses","n:personnel_pct_expenses"],["gt","h:avg_pt_staff","h:avg_ft_staff"]]
      },
      "audience": {
        lead: "Houston organizations at {lit:$1M-$2.99M} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "More budget doesn't always mean more attendance. This group's average is above the next budget size up, at {h:avg_attendance@3m-10m}.",
        claims: [["gt","h:avg_attendance","h:avg_attendance@3m-10m"]]
      },
      "facilities": {
        lead: "{h:primary_facility|rent} of Houston organizations at {lit:$1M-$2.99M} rent their main space, and {h:primary_facility|own} own theirs.",
        why: "Ownership matches the national number. Renting's more common here, and donated space is less so, {h:primary_facility|donated_in_kind} vs. {n:primary_facility|donated_in_kind}.",
        claims: [["eq","h:primary_facility|own","n:primary_facility|own"],["gt","h:primary_facility|rent","n:primary_facility|rent"],["lt","h:primary_facility|donated_in_kind","n:primary_facility|donated_in_kind"]]
      }
    },
    "3m-10m": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|3m-10m} of these {h:orgs_total} Houston organizations spend {lit:$3M} to {lit:$9.99M} a year.",
        why: "It's close to the national share, {h:orgs_by_budget_share|3m-10m} here vs. {n:orgs_by_budget_share|3m-10m} nationally. With this few organizations, treat the averages as a rough guide, not a hard finding for this budget size.",
        claims: [["near","h:orgs_by_budget_share|3m-10m","n:orgs_by_budget_share|3m-10m"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations at {lit:$3M-$9.99M} spend. The national benchmark is {n:local_gov_pct_expenses}.",
        why: "Individuals are the biggest named source of contributed revenue at this size: {h:contributed_sources|individuals}.",
        claims: [["largest","h:contributed_sources|individuals"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what these Houston organizations spend goes to people. The national benchmark is {n:personnel_pct_expenses}.",
        why: "That's the widest gap from the national number of any budget size. Keep in mind it's only {h:orgs_by_budget_count|3m-10m} organizations.",
        claims: [["widest","personnel_pct_expenses","budget"]]
      },
      "audience": {
        lead: "Houston organizations at {lit:$3M-$9.99M} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "No other budget size is further off its national number, but this is still only {h:orgs_by_budget_count|3m-10m} organizations.",
        claims: [["widest","avg_attendance","budget"]]
      },
      "facilities": {
        lead: "{h:primary_facility|own} of Houston organizations at {lit:$3M-$9.99M} own their main space. The national benchmark is {n:primary_facility|own}.",
        why: "That's the highest ownership share of any budget size. But with only {h:orgs_by_budget_count|3m-10m} organizations, each owned space really swings this number.",
        claims: [["top","h:primary_facility|own","budget"]]
      }
    },
    "10m-plus": {
      "sector-profile": {
        lead: "{h:orgs_by_budget_count|10m-plus} of these {h:orgs_total} Houston organizations spend {lit:$10M} or more a year.",
        why: "They're just {h:orgs_by_budget_share|10m-plus} of the group, but they pull up the averages for all of it. Attendance averages {h:avg_attendance@10m-plus} here vs. {h:avg_attendance@overall} overall.",
        claims: [["gt","h:avg_attendance@10m-plus","h:avg_attendance@overall"]]
      },
      "funding": {
        lead: "Local government support equals {h:local_gov_pct_expenses} of what Houston organizations at {lit:$10M+} spend, close to the {n:local_gov_pct_expenses} in the national benchmark.",
        why: "No other budget size depends on earned revenue this much, {h:earned_vs_contributed|earned} of revenue.",
        claims: [["near","h:local_gov_pct_expenses","n:local_gov_pct_expenses"],["top","h:earned_vs_contributed|earned","budget"]]
      },
      "workforce": {
        lead: "{h:personnel_pct_expenses} of what these Houston organizations spend goes to people, close to the {n:personnel_pct_expenses} in the national benchmark.",
        why: "These are the biggest teams in the group, {h:avg_ft_staff} full-time and {h:avg_pt_staff} part-time staff on average.",
        claims: [["near","h:personnel_pct_expenses","n:personnel_pct_expenses"],["top","h:avg_ft_staff","budget"],["top","h:avg_pt_staff","budget"]]
      },
      "audience": {
        lead: "Houston organizations at {lit:$10M+} averaged {h:avg_attendance} in attendance each. The national benchmark is {n:avg_attendance}.",
        why: "These {h:orgs_by_budget_count|10m-plus} organizations push the overall average of {h:avg_attendance@overall} above what most budget groups see.",
        claims: [["gt","h:avg_attendance","h:avg_attendance@overall"],["lt","h:avg_attendance@under-250k","h:avg_attendance@overall"],["lt","h:avg_attendance@250k-1m","h:avg_attendance@overall"],["lt","h:avg_attendance@3m-10m","h:avg_attendance@overall"]]
      },
      "facilities": {
        lead: "{h:primary_facility|own} of Houston organizations at {lit:$10M+} own their main space. The national benchmark is {n:primary_facility|own}.",
        why: "Ownership climbs with budget, from {h:primary_facility|own@under-250k} under {lit:$250K} to {h:primary_facility|own@1m-3m} at {lit:$1M-$2.99M}. It peaks at {h:primary_facility|own@3m-10m} at {lit:$3M-$9.99M}, then dips to {h:primary_facility|own} here.",
        claims: [["lt","h:primary_facility|own@under-250k","h:primary_facility|own@250k-1m"],["lt","h:primary_facility|own@250k-1m","h:primary_facility|own@1m-3m"],["lt","h:primary_facility|own@1m-3m","h:primary_facility|own@3m-10m"],["top","h:primary_facility|own@3m-10m","budget"],["gt","h:primary_facility|own@3m-10m","h:primary_facility|own"]]
      }
    }
  }
};
