import { meta as introMeta } from './introduction/_meta'
import { meta as whatIsFocuraMeta } from './introduction/what-is-focura/_meta'
import { meta as corePrinciples } from './introduction/core-principles/_meta'
import { meta as whatFocuraIsNot } from './introduction/what-focura-is-not/_meta'
import { meta as whoItsFor } from './introduction/who-its-for/_meta'

import { meta as gettingStartedMeta } from './getting-started/_meta'
import { meta as commonMistakes } from './getting-started/common-mistakes/_meta'
import { meta as createWorkspace } from './getting-started/create-workspace/_meta'
import { meta as dailyFocus } from './getting-started/daily-focus/_meta'
import { meta as firstTask } from './getting-started/first-task/_meta'
import { meta as weeklyReset } from './getting-started/weekly-reset/_meta'

import { meta as bestPractices } from './best-practices/_meta'
import { meta as archiveVsDelete } from './best-practices/archive-vs-delete/_meta'
import { meta as avoidOverplanning } from './best-practices/avoid-overplanning/_meta'
import { meta as dailyFiveMinuteRule } from './best-practices/daily-5-minute-rule/_meta'
import { meta as minimalTaskLists } from './best-practices/minimal-task-lists/_meta'
import { meta as stayConsistent } from './best-practices/stay-consistent/_meta'


import { meta as coreConcepts } from './core-concepts/_meta'
import { meta as deadlineWithoutStress } from './core-concepts/deadline-without-stress/_meta'
import { meta as flowProgress } from './core-concepts/flow-progress/_meta'
import { meta as focusState } from './core-concepts/focus-states/_meta'
import { meta as priorityEnergy } from './core-concepts/priority-energy/_meta'
import { meta as tasksVsProjects } from './core-concepts/tasks-vs-projects/_meta'
import { meta as overiew } from './core-concepts/overview/_meta'


import { meta as faq } from './faq/_meta'

import { meta as features } from './features/_meta'
import { meta as analytics } from './features/analytics/_meta'
import { meta as focusMode } from './features/focus-mode/_meta'
import { meta as notifications } from './features/notifications/_meta'
import { meta as projects } from './features/projects/_meta'
import { meta as taskManagement } from './features/task-management/_meta'

import { meta as legal } from './legal/_meta'
import { meta as privacy } from './legal/privacy/_meta'
import { meta as security } from './legal/security/_meta'
import { meta as terms } from './legal/terms/_meta'

import { meta as updates } from './updates/_meta'
import { meta as changelog } from './updates/changelog/_meta'
import { meta as philosophy } from './updates/philosophy/_meta'
import { meta as roadmap } from './updates/roadmap/_meta'

import { meta as workflows } from './workflows/_meta'
import { meta as agencyTeam } from './workflows/agency-team/_meta'
import { meta as burnoutRecovery } from './workflows/burnout-recovery/_meta'
import { meta as developerDeepWork } from './workflows/developer-deep-work/_meta'
import { meta as soloFounder } from './workflows/solo-founder/_meta'
import { meta as studentLearner } from './workflows/student-learner/_meta'
import { meta as weeklyPlanning } from './workflows/weekly-planning/_meta'

import { meta as templates } from './templates/_meta'
import { meta as howToUse } from './templates/how-to-use/_meta'
import { meta as personalTemplate } from './templates/personal/_meta'
import { meta as startupTeamTemplate } from './templates/startup-team/_meta'
import { meta as whatAreTemplate } from './templates/what-are-templates/_meta'
import { meta as whenNotToUse } from './templates/when-not-to-use/_meta'

// Add all your sections and pages here

export const sectionMetas = {
  introduction: introMeta,
  'getting-started': gettingStartedMeta,
  'best-practices': bestPractices,
  'core-concepts': coreConcepts,
  faq,
  features,
  legal,
  updates,
  workflows,
  templates
}

export const pageMetas = {
  'introduction/what-is-focura': whatIsFocuraMeta,
  'introduction/core-principles': corePrinciples,
  'introduction/what-focura-is-not': whatFocuraIsNot,
  "introduction/who-its-for": whoItsFor, 

  'getting-started/common-mistakes': commonMistakes,
  'getting-started/create-workspace': createWorkspace,
  'getting-started/daily-focus': dailyFocus,
  'getting-started/first-task': firstTask,
  'getting-started/weekly-reset': weeklyReset,

  'best-practices/archive-vs-delete': archiveVsDelete,
  'best-practices/avoid-overplanning': avoidOverplanning,
  'best-practices/daily-5-minute-rule': dailyFiveMinuteRule,
  'best-practices/minimal-task-lists': minimalTaskLists,
  'best-practices/stay-consistent': stayConsistent,

  'core-concepts/deadline-without-stress': deadlineWithoutStress,
  'core-concepts/flow-progress': flowProgress,
  'core-concepts/focus-states': focusState,
  'core-concepts/priority-energy': priorityEnergy,
  'core-concepts/tasks-vs-projects': tasksVsProjects,
  'core-concepts/overview': overiew,

  'features/analytics': analytics,
  'features/focus-mode': focusMode,
  'features/notifications': notifications,
  'features/projects': projects,
  'features/task-management': taskManagement,

  'legal/privacy': privacy,
  'legal/security': security,
  'legal/terms': terms,

  'updates/changelog': changelog,
  'updates/philosophy': philosophy,
  'updates/roadmap': roadmap,

  'workflows/agency-team': agencyTeam,
  'workflows/burnout-recovery': burnoutRecovery,
  'workflows/developer-deep-work': developerDeepWork,
  'workflows/solo-founder': soloFounder,
  'workflows/student-learner': studentLearner,
  'workflows/weekly-planning': weeklyPlanning,

  'templates/how-to-use': howToUse,
  'templates/personal': personalTemplate,
  'templates/startup-team': startupTeamTemplate,
  'templates/what-are-templates': whatAreTemplate,
  'templates/when-not-to-use': whenNotToUse
  // Add all pages
}