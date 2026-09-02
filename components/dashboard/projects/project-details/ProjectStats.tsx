import { ProjectDetails } from '@/hooks/useProjects';
import { Button } from '@/components/ui/Button';
interface ProjectStatsProps {
    activeTab: string;
    setActiveTab: (v: string) => void;
    project: ProjectDetails;
}

export default function ProjectStats({activeTab, setActiveTab, project}: ProjectStatsProps) {
  return (
    <div className="border-b border-border">
          <div className="flex gap-6">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('tasks')}
              className={`h-auto rounded-none pb-4 px-2 font-medium border-b-2 hover:bg-transparent ${
                activeTab === 'tasks'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Tasks ({project.stats.totalTasks})
            </Button>
             <Button
              variant="ghost"
              onClick={() => setActiveTab('announcements')}
              className={`h-auto rounded-none pb-4 px-2 font-medium border-b-2 hover:bg-transparent ${
                activeTab === 'announcements'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Announcement ({project.stats.totalAnnouncement})
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('members')}
              className={`h-auto rounded-none pb-4 px-2 font-medium border-b-2 hover:bg-transparent ${
                activeTab === 'members'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Members ({project.stats.totalMembers})
            </Button>
          </div>
        </div>

  )
}
