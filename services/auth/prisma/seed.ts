import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYSTEM_PERMISSIONS = [
  // User management
  { name: 'create_user', description: 'Create new users' },
  { name: 'read_user', description: 'View user information' },
  { name: 'update_user', description: 'Update user information' },
  { name: 'delete_user', description: 'Delete users' },
  { name: 'invite_user', description: 'Invite new users' },
  { name: 'assign_role', description: 'Assign roles to users' },

  // Role management
  { name: 'create_role', description: 'Create new roles' },
  { name: 'read_role', description: 'View role information' },
  { name: 'update_role', description: 'Update role information' },
  { name: 'delete_role', description: 'Delete roles' },
  { name: 'assign_permission', description: 'Assign permissions to roles' },

  // Event management
  { name: 'create_event', description: 'Create new events' },
  { name: 'read_event', description: 'View event information' },
  { name: 'update_event', description: 'Update event information' },
  { name: 'delete_event', description: 'Delete events' },
  { name: 'manage_event_schedule', description: 'Manage event schedules' },
  { name: 'manage_event_budget', description: 'Manage event budgets' },
  { name: 'manage_event_vendors', description: 'Manage event vendors' },

  // Vendor management
  { name: 'create_vendor', description: 'Create new vendors' },
  { name: 'read_vendor', description: 'View vendor information' },
  { name: 'update_vendor', description: 'Update vendor information' },
  { name: 'delete_vendor', description: 'Delete vendors' },
  { name: 'assign_vendor_to_event', description: 'Assign vendors to events' },
  { name: 'manage_vendor_contracts', description: 'Manage vendor contracts' },

  // Invoice management
  { name: 'create_invoice', description: 'Create new invoices' },
  { name: 'read_invoice', description: 'View invoice information' },
  { name: 'update_invoice', description: 'Update invoice information' },
  { name: 'delete_invoice', description: 'Delete invoices' },
  { name: 'approve_invoice', description: 'Approve invoices' },
  { name: 'process_payment', description: 'Process payments' },

  // Deliverable management
  { name: 'create_deliverable', description: 'Create new deliverables' },
  { name: 'read_deliverable', description: 'View deliverable information' },
  { name: 'update_deliverable', description: 'Update deliverable information' },
  { name: 'delete_deliverable', description: 'Delete deliverables' },
  { name: 'approve_deliverable', description: 'Approve deliverables' },

  // Analytics and reporting
  { name: 'view_analytics', description: 'View analytics and reports' },
  { name: 'export_reports', description: 'Export reports' },
  { name: 'view_financial_reports', description: 'View financial reports' },
  { name: 'view_performance_metrics', description: 'View performance metrics' },

  // System administration
  { name: 'manage_system_settings', description: 'Manage system settings' },
  { name: 'view_system_health', description: 'View system health status' },
  { name: 'manage_backups', description: 'Manage system backups' },
  { name: 'view_audit_logs', description: 'View audit logs' },
  { name: 'manage_integrations', description: 'Manage system integrations' },

  // Email management
  { name: 'send_email', description: 'Send emails' },
  { name: 'manage_email_templates', description: 'Manage email templates' },
  { name: 'view_email_logs', description: 'View email logs' },
  { name: 'manage_email_settings', description: 'Manage email settings' },

  // File management
  { name: 'upload_files', description: 'Upload files' },
  { name: 'download_files', description: 'Download files' },
  { name: 'delete_files', description: 'Delete files' },
  { name: 'manage_file_permissions', description: 'Manage file permissions' },

  // Notification management
  { name: 'send_notifications', description: 'Send notifications' },
  { name: 'manage_notification_settings', description: 'Manage notification settings' },
  { name: 'view_notification_logs', description: 'View notification logs' },

  // API management
  { name: 'access_api', description: 'Access API endpoints' },
  { name: 'manage_api_keys', description: 'Manage API keys' },
  { name: 'view_api_logs', description: 'View API logs' },
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create permissions
  console.log('📝 Creating permissions...');
  for (const permission of SYSTEM_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: {
        name: permission.name,
        description: permission.description,
      },
    });
  }
  console.log(`✅ Created ${SYSTEM_PERMISSIONS.length} permissions`);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 