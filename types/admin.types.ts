export interface AdminStats {
  totals: {
    users: number;
    workspaces: number;
    projects: number;
    tasks: number;
    announcements: number;
    meetings: number;
  };
  plans: { plan: string; count: number }[];
  featureRequests: {
    pending: number;
    approved: number;
    planned: number;
    completed: number;
    rejected: number;
  };
  totalStorageUsedMb: number;
  recentSignups: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: string;
  }[];
  recentWorkspaces: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    createdAt: string;
    owner: { id: string; name: string; email: string };
    _count: { members: number; projects: number };
  }[];
}

export interface AdminWorkspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: string;
  maxMembers: number;
  maxStorageMb: number;
  usedStorageMb: number;
  owner: { id: string; name: string; email: string; image: string | null };
  subscription: {
    status: string;
    billingCycle: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    planName: string;
    monthlyPriceCents: number;
  } | null;
  _count: { members: number; projects: number; tasks: number };
}

export interface AdminWorkspaceDetail {
  id: string;
  name: string;
  slug: string;
  plan: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  maxMembers: number;
  maxStorageMb: number;
  usedStorageMb: number;
  owner: { id: string; name: string; email: string; image: string | null };
  subscription: {
    id: string;
    status: string;
    billingCycle: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
    stripeCustomerId: string;
    plan: {
      id: string;
      name: string;
      displayName: string;
      monthlyPriceCents: number;
      yearlyPriceCents: number;
      maxMembersPerWs: number;
      maxStorageMb: number;
      maxProjects: number;
      maxMeetingsPerMo: number;
      analyticsAccess: boolean;
      prioritySupport: boolean;
      apiAccess: boolean;
    };
    invoices: {
      id: string;
      stripeInvoiceId: string;
      amountPaid: number;
      currency: string;
      status: string;
      paidAt: string | null;
      invoicePdf: string | null;
      periodStart: string | null;
      periodEnd: string | null;
    }[];
  } | null;
  members: {
    id: string;
    role: string;
    joinedAt: string;
    user: { id: string; name: string; email: string; image: string | null };
  }[];
  projects: {
    id: string;
    name: string;
    slug: string;
    status: string;
    priority: string;
    createdAt: string;
    createdBy: { id: string; name: string };
    _count: { tasks: number; members: number };
  }[];
  _count: {
    members: number;
    projects: number;
    tasks: number;
    meetings: number;
    announcements: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  _count: {
    ownedWorkspaces: number;
    workspaceMember: number;
    createdTasks: number;
    comments: number;
    focusSessions: number;
    featureRequests: number;
  };
}

export interface AdminUserDetail {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  bio: string | null;
  timezone: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  lastProfileUpdateAt: string | null;
  ownedWorkspaces: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    _count: { members: number; projects: number };
  }[];
  workspaceMemberships: {
    role: string;
    joinedAt: string;
    workspace: { id: string; name: string; slug: string; plan: string };
  }[];
  projectMemberships: {
    role: string;
    joinedAt: string;
    project: {
      id: string;
      name: string;
      slug: string;
      status: string;
      workspace: { id: string; name: string };
    };
  }[];
  recentTasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
    project: { id: string; name: string } | null;
    workspace: { id: string; name: string } | null;
  }[];
  featureRequests: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }[];
  taskStats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  storage: { usedMb: number; fileCount: number };
  _count: {
    ownedWorkspaces: number;
    workspaceMember: number;
    createdTasks: number;
    assignedTasks: number;
    comments: number;
    focusSessions: number;
    featureRequests: number;
    files: number;
  };
}

export interface AdminProject {
  id: string;
  name: string;
  slug: string;
  status: string;
  priority: string;
  createdAt: string;
  dueDate: string | null;
  completedAt: string | null;
  workspace: { id: string; name: string; slug: string };
  createdBy: { id: string; name: string; email: string };
  manager: { id: string; name: string; email: string } | null;
  taskBreakdown: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  _count: { tasks: number; members: number; files: number };
}

export interface AdminBilling {
  subscriptionId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  billingCycle: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  plan: {
    id: string;
    name: string;
    displayName: string;
    monthlyPriceCents: number;
    yearlyPriceCents: number;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    owner: { id: string; name: string; email: string };
  };
  recentInvoices: {
    id: string;
    amountPaid: number;
    currency: string;
    status: string;
    paidAt: string | null;
    invoicePdf: string | null;
  }[];
}

export interface AdminActivity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  metadata: any;
  user: { id: string; name: string; email: string; image: string | null };
  workspace: { id: string; name: string; slug: string } | null;
}

export interface AdminPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AdminPaginatedResponse<T> {
  data: T[];
  pagination: AdminPagination;
}
