import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, FolderGit2, Upload, FileText, Image, File, 
  Download, Trash2, Plus, X, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useResources, useUploadResource, useDeleteResource, Resource } from '@/hooks/useResources';
import { useAuth } from '@/hooks/useAuth';

const getFileIcon = (fileType: string | null) => {
  if (!fileType) return File;
  if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('word')) return FileText;
  if (fileType.includes('image')) return Image;
  return File;
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ResourceCard = ({ 
  resource, 
  isAdmin, 
  onDelete 
}: { 
  resource: Resource; 
  isAdmin: boolean;
  onDelete: (resource: Resource) => void;
}) => {
  const FileIcon = getFileIcon(resource.file_type);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileIcon className="w-5 h-5 text-primary" />
            </div>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                onClick={() => onDelete(resource)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <CardTitle className="text-lg line-clamp-1">{resource.title}</CardTitle>
          {resource.description && (
            <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatFileSize(resource.file_size)}
            </span>
            <Button asChild size="sm" variant="outline">
              <a href={resource.file_url} target="_blank" rel="noopener noreferrer" download>
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const UploadDialog = ({ 
  category, 
  onSuccess 
}: { 
  category: 'study_material' | 'project';
  onSuccess: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadResource = useUploadResource();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title.trim()) {
      toast.error('Please provide a title and select a file');
      return;
    }

    try {
      await uploadResource.mutateAsync({
        file,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
      });
      
      toast.success('Resource uploaded successfully!');
      setOpen(false);
      setTitle('');
      setDescription('');
      setFile(null);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload resource');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 50MB limit
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Upload {category === 'study_material' ? 'Study Material' : 'Project'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Upload {category === 'study_material' ? 'Study Material' : 'Project File'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this resource"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the resource"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>File</Label>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
            />
            {file ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border">
                <FileText className="w-5 h-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-24 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to select a file</span>
                </div>
              </Button>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploadResource.isPending}>
              {uploadResource.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Resources = () => {
  const { isAdmin } = useAuth();
  const { data: studyMaterials, isLoading: loadingStudy, refetch: refetchStudy } = useResources('study_material');
  const { data: projects, isLoading: loadingProjects, refetch: refetchProjects } = useResources('project');
  const deleteResource = useDeleteResource();

  const handleDelete = async (resource: Resource) => {
    if (!confirm(`Are you sure you want to delete "${resource.title}"?`)) return;
    
    try {
      await deleteResource.mutateAsync(resource);
      toast.success('Resource deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete resource');
    }
  };

  return (
    <>
      <Helmet>
        <title>Resources | Manish Singh</title>
        <meta name="description" content="Download study materials and project files shared by Manish Singh" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Resources
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse and download study materials and project files
            </p>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="study_materials" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="study_materials" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Study Materials
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" />
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="study_materials" className="space-y-6">
              {isAdmin && (
                <div className="flex justify-end">
                  <UploadDialog category="study_material" onSuccess={() => refetchStudy()} />
                </div>
              )}
              
              {loadingStudy ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : studyMaterials && studyMaterials.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studyMaterials.map((resource) => (
                    <ResourceCard 
                      key={resource.id} 
                      resource={resource} 
                      isAdmin={isAdmin}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No study materials uploaded yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              {isAdmin && (
                <div className="flex justify-end">
                  <UploadDialog category="project" onSuccess={() => refetchProjects()} />
                </div>
              )}
              
              {loadingProjects ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((resource) => (
                    <ResourceCard 
                      key={resource.id} 
                      resource={resource} 
                      isAdmin={isAdmin}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderGit2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No project files uploaded yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Resources;
