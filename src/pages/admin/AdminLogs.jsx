import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { FileText } from 'lucide-react';

const AdminLogs = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">System Audit Logs</h1>

      <Card>
        <CardContent className="p-8">
          <EmptyState
            icon={FileText}
            title="No logs available"
            description="Audit logging is currently disabled or no significant actions have been recorded yet."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;
