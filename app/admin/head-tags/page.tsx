"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import PageHeader from "@/components/dashboard/page-header"
import { 
  Plus, Trash2, Code2, Eye, CheckCircle2, XCircle, 
  AlertTriangle, Copy, RefreshCw, FileCode
} from "lucide-react"

interface HeadTag {
  _id: string
  tag_content: string
  tag_type: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

const TAG_TYPES = [
  { value: "meta", label: "Meta Tag" },
  { value: "link", label: "Link Tag" },
  { value: "script", label: "Script Tag" },
  { value: "style", label: "Style Tag" },
  { value: "other", label: "Other" },
]

export default function HeadTagsManagementPage() {
  const [tags, setTags] = useState<HeadTag[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newTag, setNewTag] = useState({
    tag_content: "",
    tag_type: "meta",
    description: "",
    is_active: true,
  })
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/admin/head-tags")
      if (res.ok) {
        const data = await res.json()
        setTags(data)
      }
    } catch (error) {
      console.error("Failed to fetch head tags:", error)
      toast({ title: "Error", description: "Failed to load head tags", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const validateTag = (content: string): string | null => {
    const trimmed = content.trim()
    
    if (!trimmed) {
      return "Tag content is required"
    }
    
    if (!trimmed.startsWith('<')) {
      return "Tag must start with <"
    }
    
    if (!trimmed.endsWith('>')) {
      return "Tag must end with >"
    }
    
    // Check for self-closing tags
    const selfClosingTags = ['meta', 'link', 'base', 'br', 'hr', 'img', 'input', 'col', 'area', 'embed', 'keygen', 'param', 'source', 'track', 'wbr']
    const tagNameMatch = trimmed.match(/<(\w+)/)
    
    if (tagNameMatch) {
      const tagName = tagNameMatch[1].toLowerCase()
      const isSelfClosing = selfClosingTags.includes(tagName) || trimmed.endsWith('/>')
      
      if (!isSelfClosing) {
        const hasClosing = trimmed.includes(`</${tagName}>`)
        if (!hasClosing) {
          return `Tag appears incomplete. Add closing tag </${tagName}> or use self-closing format />`
        }
      }
    }
    
    return null
  }

  const handleAddTag = async () => {
    const error = validateTag(newTag.tag_content)
    if (error) {
      setValidationError(error)
      return
    }
    
    setSaving(true)
    setValidationError(null)
    
    try {
      const res = await fetch("/api/admin/head-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setTags([data, ...tags])
        setNewTag({ tag_content: "", tag_type: "meta", description: "", is_active: true })
        toast({ title: "Success", description: "Head tag added successfully" })
      } else {
        setValidationError(data.error || "Failed to add tag")
        toast({ title: "Error", description: data.error || "Failed to add tag", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add tag", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/head-tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      })
      
      if (res.ok) {
        setTags(tags.map(tag => 
          tag._id === id ? { ...tag, is_active: !currentStatus } : tag
        ))
        toast({ title: "Updated", description: `Tag ${!currentStatus ? 'activated' : 'deactivated'}` })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update tag", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return
    
    try {
      const res = await fetch(`/api/admin/head-tags/${id}`, { method: "DELETE" })
      
      if (res.ok) {
        setTags(tags.filter(tag => tag._id !== id))
        toast({ title: "Deleted", description: "Head tag removed" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete tag", variant: "destructive" })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied", description: "Tag copied to clipboard" })
  }

  const getTagTypeColor = (type: string) => {
    switch (type) {
      case "meta": return "bg-blue-100 text-blue-700"
      case "link": return "bg-purple-100 text-purple-700"
      case "script": return "bg-amber-100 text-amber-700"
      case "style": return "bg-emerald-100 text-emerald-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const activeTags = tags.filter(t => t.is_active)

  return (
    <div className="w-full pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader
          title="Head Tags Management"
          description="Add and manage custom HTML tags for the website head section"
          showBackButton
          backHref="/admin/dashboard"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Code2 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tags.length}</p>
                  <p className="text-xs text-muted-foreground">Total Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeTags.length}</p>
                  <p className="text-xs text-muted-foreground">Active Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-500/10">
                  <XCircle className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tags.length - activeTags.length}</p>
                  <p className="text-xs text-muted-foreground">Inactive Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Tag */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Head Tag
            </CardTitle>
            <CardDescription className="text-xs">
              Add meta tags, link tags, scripts, or other HTML elements to the website head section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Label htmlFor="tag_content" className="text-xs">Tag Content</Label>
                <Textarea
                  id="tag_content"
                  placeholder='<tag>'
                  value={newTag.tag_content}
                  onChange={(e) => {
                    setNewTag({ ...newTag, tag_content: e.target.value })
                    setValidationError(null)
                  }}
                  className="mt-1.5 font-mono text-sm min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="tag_type" className="text-xs">Tag Type</Label>
                <Select
                  value={newTag.tag_type}
                  onValueChange={(value) => setNewTag({ ...newTag, tag_type: value })}
                >
                  <SelectTrigger id="tag_type" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAG_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Label htmlFor="description" className="text-xs">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description of what this tag does"
                  value={newTag.description}
                  onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-end gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={newTag.is_active}
                    onCheckedChange={(checked) => setNewTag({ ...newTag, is_active: checked })}
                  />
                  <Label htmlFor="is_active" className="text-xs">Active</Label>
                </div>
              </div>
            </div>

            {validationError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                <AlertTriangle className="h-4 w-4" />
                {validationError}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button onClick={handleAddTag} disabled={saving || !newTag.tag_content.trim()}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Head Preview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Head Tag Preview
                </CardTitle>
                <CardDescription className="text-xs">
                  Preview of active tags that will be added to the website head
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
          </CardHeader>
          {showPreview && (
            <CardContent>
              <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <div className="text-muted-foreground">&lt;head&gt;</div>
                <div className="pl-4 space-y-1">
                  <div className="text-muted-foreground">{"  "}... other head content ...</div>
                  {activeTags.length === 0 ? (
                    <div className="text-muted-foreground italic">{"  "}No active custom tags</div>
                  ) : (
                    activeTags.map(tag => (
                      <div key={tag._id} className="text-emerald-600">
                        {"  "}{tag.tag_content}
                      </div>
                    ))
                  )}
                </div>
                <div className="text-muted-foreground">&lt;/head&gt;</div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Tags Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              All Head Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs w-10">Status</TableHead>
                  <TableHead className="text-xs">Tag Content</TableHead>
                  <TableHead className="text-xs w-24">Type</TableHead>
                  <TableHead className="text-xs w-48">Description</TableHead>
                  <TableHead className="text-xs w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : tags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Code2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No head tags added yet</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  tags.map((tag) => (
                    <TableRow key={tag._id}>
                      <TableCell className="py-2">
                        <Switch
                          checked={tag.is_active}
                          onCheckedChange={() => handleToggleActive(tag._id, tag.is_active)}
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono block max-w-md overflow-hidden text-ellipsis whitespace-nowrap">
                          {tag.tag_content}
                        </code>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="secondary" className={`text-[10px] ${getTagTypeColor(tag.tag_type)}`}>
                          {tag.tag_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {tag.description || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => copyToClipboard(tag.tag_content)}
                            title="Copy tag"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(tag._id)}
                            title="Delete tag"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
