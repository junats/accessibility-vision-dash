import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle, Globe, Scan, Zap, ExternalLink, TrendingUp, Shield, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AccessibilityIssue {
  type: 'error' | 'warning';
  code: string;
  message: string;
  selector: string;
  context: string;
}

interface PageResult {
  url: string;
  title: string;
  issues: AccessibilityIssue[];
  passed: number;
  failed: number;
  warnings: number;
  loadTime: number;
  statusCode: number;
}

interface ScanResult {
  url: string;
  timestamp: string;
  totalPages: number;
  pagesScanned: PageResult[];
  totalPassed: number;
  totalFailed: number;
  totalWarnings: number;
  scanDuration: number;
  complianceScore: number;
}

const getFixExample = (issue: AccessibilityIssue): string => {
  switch (issue.code) {
    case 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37':
      return '<img src="hero-image.jpg" alt="Hero image showing our main product" class="hero-img">';
    case 'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl':
      return '<html><head><title>About Us - Company Name</title>...</head>';
    case 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H43.IncorrectAttr':
      return '<th scope="col">Product Name</th>';
    case 'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Button.Name':
      return '<button class="submit-btn" aria-label="Submit contact form">Submit</button>';
    case 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail':
      return '<span class="text-gray-600">Secondary text</span> <!-- Use darker color for better contrast -->';
    default:
      return '<!-- Please refer to WCAG guidelines for specific fix recommendations -->';
  }
};

export const AccessibilityScanner = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanFullDomain, setScanFullDomain] = useState(false);
  const [accessibilityStandards, setAccessibilityStandards] = useState({
    wcag21: true,
    wcag22: false,
    section508: false,
    ada: false,
    en301549: false,
  });
  const { toast } = useToast();

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scan",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (include http:// or https://)",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    if (scanFullDomain) {
      // Simulate domain-wide scan with multiple pages
      setTimeout(() => {
        const baseUrl = url.replace(/\/+$/, '').replace(/\/{2,}/g, '/');
        
        // Generate realistic pages for a comprehensive domain scan
        const pageTemplates = [
          { path: '', title: 'Home Page', errorRate: 0.1 },
          { path: '/about', title: 'About Us', errorRate: 0.05 },
          { path: '/contact', title: 'Contact Us', errorRate: 0.15 },
          { path: '/products', title: 'Products', errorRate: 0.08 },
          { path: '/services', title: 'Services', errorRate: 0.06 },
          { path: '/blog', title: 'Blog', errorRate: 0.02 },
          { path: '/news', title: 'News', errorRate: 0.03 },
          { path: '/careers', title: 'Careers', errorRate: 0.07 },
          { path: '/support', title: 'Support', errorRate: 0.12 },
          { path: '/privacy', title: 'Privacy Policy', errorRate: 0.04 },
          { path: '/terms', title: 'Terms of Service', errorRate: 0.04 },
          { path: '/faq', title: 'FAQ', errorRate: 0.09 },
          { path: '/team', title: 'Our Team', errorRate: 0.06 },
          { path: '/pricing', title: 'Pricing', errorRate: 0.08 },
          { path: '/portfolio', title: 'Portfolio', errorRate: 0.05 },
          { path: '/testimonials', title: 'Testimonials', errorRate: 0.03 },
          { path: '/login', title: 'Login', errorRate: 0.11 },
          { path: '/register', title: 'Register', errorRate: 0.13 },
          { path: '/dashboard', title: 'Dashboard', errorRate: 0.07 },
          { path: '/profile', title: 'User Profile', errorRate: 0.06 },
          { path: '/settings', title: 'Settings', errorRate: 0.08 },
          { path: '/help', title: 'Help Center', errorRate: 0.05 },
          { path: '/downloads', title: 'Downloads', errorRate: 0.04 },
          { path: '/gallery', title: 'Gallery', errorRate: 0.03 },
          { path: '/events', title: 'Events', errorRate: 0.06 },
          { path: '/locations', title: 'Locations', errorRate: 0.05 },
          { path: '/partners', title: 'Partners', errorRate: 0.04 },
          { path: '/investors', title: 'Investors', errorRate: 0.03 },
          { path: '/press', title: 'Press Releases', errorRate: 0.02 },
          { path: '/sitemap', title: 'Sitemap', errorRate: 0.01 },
        ];

        // Generate additional blog posts and product pages
        const additionalPages = [];
        for (let i = 1; i <= 20; i++) {
          additionalPages.push({
            path: `/blog/post-${i}`,
            title: `Blog Post ${i}`,
            errorRate: 0.02 + Math.random() * 0.04
          });
        }
        for (let i = 1; i <= 10; i++) {
          additionalPages.push({
            path: `/products/product-${i}`,
            title: `Product ${i}`,
            errorRate: 0.05 + Math.random() * 0.08
          });
        }

        const allPageTemplates = [...pageTemplates, ...additionalPages];
        
        const mockPages: PageResult[] = allPageTemplates.slice(0, 60).map((template, index) => {
          const hasErrors = Math.random() < template.errorRate;
          const hasWarnings = Math.random() < 0.3;
          
          const issues: AccessibilityIssue[] = [];
          
          if (hasErrors) {
            const errorTypes = [
              {
                type: 'error' as const,
                code: 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37',
                message: 'Img element missing an alt attribute',
                selector: 'img[src="hero-image.jpg"]',
                context: '<img src="hero-image.jpg" class="hero-img">'
              },
              {
                type: 'error' as const,
                code: 'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Button.Name',
                message: 'Button element must have accessible name',
                selector: 'button.submit-btn',
                context: '<button class="submit-btn">Submit</button>'
              },
              {
                type: 'error' as const,
                code: 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H43.IncorrectAttr',
                message: 'Table headers missing scope attribute',
                selector: 'table th',
                context: '<th>Product Name</th>'
              }
            ];
            
            const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
            issues.push(randomError);
          }
          
          if (hasWarnings) {
            const warningTypes = [
              {
                type: 'warning' as const,
                code: 'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
                message: 'Document should have a title element',
                selector: 'html',
                context: '<html><head>...'
              },
              {
                type: 'warning' as const,
                code: 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail',
                message: 'Insufficient color contrast',
                selector: '.text-gray-400',
                context: '<span class="text-gray-400">Secondary text</span>'
              }
            ];
            
            const randomWarning = warningTypes[Math.floor(Math.random() * warningTypes.length)];
            issues.push(randomWarning);
          }
          
          const passed = Math.floor(Math.random() * 20) + 25; // 25-45 passed tests
          const failed = issues.filter(i => i.type === 'error').length;
          const warnings = issues.filter(i => i.type === 'warning').length;
          const loadTime = Math.round((Math.random() * 2 + 0.5) * 10) / 10; // 0.5-2.5s
          
          return {
            url: `${baseUrl}${template.path}`,
            title: template.title,
            issues,
            passed,
            failed,
            warnings,
            loadTime,
            statusCode: Math.random() < 0.95 ? 200 : (Math.random() < 0.5 ? 404 : 500)
          };
        });

        const totalPassed = mockPages.reduce((sum, page) => sum + page.passed, 0);
        const totalFailed = mockPages.reduce((sum, page) => sum + page.failed, 0);
        const totalWarnings = mockPages.reduce((sum, page) => sum + page.warnings, 0);
        const complianceScore = Math.round((totalPassed / (totalPassed + totalFailed)) * 100);

        const mockResult: ScanResult = {
          url,
          timestamp: new Date().toISOString(),
          totalPages: mockPages.length,
          pagesScanned: mockPages,
          totalPassed,
          totalFailed,
          totalWarnings,
          scanDuration: 15.3, // Longer scan time for more pages
          complianceScore
        };
        
        setScanResult(mockResult);
        setIsScanning(false);
        
        toast({
          title: "Domain Scan Complete",
          description: `Scanned ${mockResult.totalPages} pages. Found ${mockResult.totalFailed} errors and ${mockResult.totalWarnings} warnings`,
        });
      }, 8000); // Longer scanning time for more realistic feel
    } else {
      // Simulate single page scan
      setTimeout(() => {
        const singlePage: PageResult = {
          url,
          title: "Single Page",
          issues: [
            {
              type: 'error',
              code: 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37',
              message: 'Img element missing an alt attribute',
              selector: 'img[src="hero-image.jpg"]',
              context: '<img src="hero-image.jpg" class="hero-img">'
            },
            {
              type: 'warning',
              code: 'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
              message: 'Document should have a title element',
              selector: 'html',
              context: '<html><head>...'
            }
          ],
          passed: 28,
          failed: 1,
          warnings: 1,
          loadTime: 1.2,
          statusCode: 200
        };

        const complianceScore = Math.round((singlePage.passed / (singlePage.passed + singlePage.failed)) * 100);

        const mockResult: ScanResult = {
          url,
          timestamp: new Date().toISOString(),
          totalPages: 1,
          pagesScanned: [singlePage],
          totalPassed: singlePage.passed,
          totalFailed: singlePage.failed,
          totalWarnings: singlePage.warnings,
          scanDuration: 2.1,
          complianceScore
        };
        
        setScanResult(mockResult);
        setIsScanning(false);
        
        toast({
          title: "Page Scan Complete",
          description: `Found ${mockResult.totalFailed} errors and ${mockResult.totalWarnings} warnings`,
        });
      }, 2000);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setUrl("");
  };

  if (scanResult) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Scan Complete</span>
            </div>
            <h1 className="text-4xl font-bold gradient-text">Accessibility Report</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Scanned {scanResult.totalPages} page{scanResult.totalPages > 1 ? 's' : ''} in {scanResult.scanDuration}s
            </p>
          </div>

          {/* Gauge Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Compliance Score</span>
                  </div>
                  <Badge variant={scanResult.complianceScore >= 90 ? "default" : scanResult.complianceScore >= 70 ? "secondary" : "destructive"}>
                    {scanResult.complianceScore >= 90 ? "Excellent" : scanResult.complianceScore >= 70 ? "Good" : "Needs Work"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={scanResult.complianceScore >= 90 ? "hsl(var(--primary))" : scanResult.complianceScore >= 70 ? "#eab308" : "#ef4444"}
                        strokeWidth="2"
                        strokeDasharray={`${scanResult.complianceScore}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{scanResult.complianceScore}%</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold">{scanResult.complianceScore}%</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Tests Passed</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray={`${Math.round((scanResult.totalPassed / (scanResult.totalPassed + scanResult.totalFailed)) * 100)}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">{Math.round((scanResult.totalPassed / (scanResult.totalPassed + scanResult.totalFailed)) * 100)}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-green-400">{scanResult.totalPassed}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((scanResult.totalPassed / (scanResult.totalPassed + scanResult.totalFailed)) * 100)}% success rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium">Critical Issues</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray={`${Math.min((scanResult.totalFailed / Math.max(scanResult.totalFailed, 5)) * 100, 100)}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-red-400">{scanResult.totalFailed}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-red-400">{scanResult.totalFailed}</div>
                    <div className="text-sm text-muted-foreground">
                      Across {scanResult.pagesScanned.filter(p => p.failed > 0).length} page{scanResult.pagesScanned.filter(p => p.failed > 0).length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">Warnings</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-yellow-400">{scanResult.totalWarnings}</div>
                  <div className="text-sm text-muted-foreground">
                    Issues to review
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Avg Load Time</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-400">
                    {(scanResult.pagesScanned.reduce((sum, page) => sum + page.loadTime, 0) / scanResult.pagesScanned.length).toFixed(1)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Performance metric</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">Warnings</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="2"
                        strokeDasharray={`${Math.min((scanResult.totalWarnings / Math.max(scanResult.totalWarnings, 5)) * 100, 100)}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-yellow-400">{scanResult.totalWarnings}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-yellow-400">{scanResult.totalWarnings}</div>
                    <div className="text-sm text-muted-foreground">
                      Recommendations for improvement
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pages Scanned Table */}
          <Card className="glass-effect mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Pages Scanned ({scanResult.totalPages})
              </CardTitle>
              <CardDescription>
                Detailed breakdown of each page scanned during the accessibility audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Load Time</TableHead>
                    <TableHead className="text-center">Passed</TableHead>
                    <TableHead className="text-center">Errors</TableHead>
                    <TableHead className="text-center">Warnings</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanResult.pagesScanned.map((page, index) => {
                    const pageScore = Math.round((page.passed / (page.passed + page.failed)) * 100);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-sm truncate max-w-xs" title={page.url}>
                              {page.url}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={page.statusCode === 200 ? "default" : "destructive"}>
                            {page.statusCode}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono">{page.loadTime}s</TableCell>
                        <TableCell className="text-center">
                          <span className="text-green-600 font-semibold">{page.passed}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-semibold ${page.failed > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                            {page.failed}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-semibold ${page.warnings > 0 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                            {page.warnings}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={pageScore >= 90 ? "default" : pageScore >= 70 ? "secondary" : "destructive"}
                              className="relative"
                            >
                              {pageScore}%
                            </Badge>
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  pageScore >= 90 ? 'bg-green-500' : pageScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${pageScore}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* All Issues */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                All Issues Found
              </CardTitle>
              <CardDescription>
                Comprehensive list of accessibility issues across all scanned pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scanResult.pagesScanned.map((page, pageIndex) => {
                if (page.issues.length === 0) return null;
                
                return (
                  <div key={pageIndex} className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{page.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {page.url}
                      </Badge>
                    </div>
                    
                    {page.issues.map((issue, issueIndex) => (
                      <div key={issueIndex} className="ml-6 p-4 rounded-lg border bg-card/50">
                        <div className="flex items-start gap-3">
                          <Badge variant={issue.type === 'error' ? 'destructive' : 'secondary'}>
                            {issue.type}
                          </Badge>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-medium">{issue.message}</h3>
                            <p className="text-sm text-muted-foreground">
                              <strong>Rule:</strong> {issue.code}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Selector:</strong> <code className="bg-muted px-2 py-1 rounded">{issue.selector}</code>
                            </p>
                            <details className="text-sm">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                View context & fix example
                              </summary>
                              <div className="mt-2 space-y-3">
                                <div>
                                  <p className="text-xs font-medium mb-1">Current code:</p>
                                  <pre className="p-2 bg-muted rounded text-xs overflow-x-auto">
                                    {issue.context}
                                  </pre>
                                </div>
                                <div>
                                  <p className="text-xs font-medium mb-1 text-green-600">Suggested fix:</p>
                                  <pre className="p-2 bg-card border border-green-500/30 rounded text-xs overflow-x-auto text-green-600">
                                    {getFixExample(issue)}
                                  </pre>
                                </div>
                              </div>
                            </details>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={resetScan} variant="outline">
              <Scan className="w-4 h-4 mr-2" />
              New Scan
            </Button>
            <Button onClick={() => window.print()}>
              Export Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const standardsDescriptions = {
    wcag21: {
      name: "WCAG 2.1 AA",
      description: "Web Content Accessibility Guidelines 2.1 Level AA - Global standard for web accessibility"
    },
    wcag22: {
      name: "WCAG 2.2 AA", 
      description: "Latest WCAG guidelines with enhanced mobile and cognitive accessibility requirements"
    },
    section508: {
      name: "Section 508",
      description: "US Federal accessibility standard for government agencies and contractors"
    },
    ada: {
      name: "ADA Compliance",
      description: "Americans with Disabilities Act requirements for public accommodations"
    },
    en301549: {
      name: "EN 301 549",
      description: "European accessibility standard for ICT products and services"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          {/* VUDU3CAN Logo */}
          <div className="relative inline-flex items-center justify-center w-32 h-32">
            {/* Scanning rings animation */}
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30"></div>
              <div className="absolute inset-2 rounded-full border-2 border-cyan-400/50 animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="absolute inset-4 rounded-full border-2 border-cyan-400/70 animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
              {/* Scanning dots */}
              <div className="absolute top-2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-2 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute top-1/2 left-2 w-1 h-1 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-1/2 right-2 w-1 h-1 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
            </div>
            
            {/* Logo text */}
            <div className="relative z-10 text-center">
              <h1 className="text-2xl font-bold text-white tracking-wider" style={{
                textShadow: '0 0 20px rgba(34, 211, 238, 0.5)',
                fontFamily: 'monospace',
                fontWeight: 900
              }}>
                VUDU3CAN
              </h1>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-primary">Accessibility Scanner</p>
            <p className="text-muted-foreground">
              Comprehensive WCAG compliance testing for your website
            </p>
          </div>
        </div>

        {/* Scan Form */}
        <Card className="glass-effect glow-effect animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Globe className="w-5 h-5" />
              Website Scanner
            </CardTitle>
            <CardDescription>
              Enter the URL you want to test for accessibility issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 text-lg"
                disabled={isScanning}
              />
              
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="space-y-1">
                  <Label htmlFor="scan-mode" className="text-sm font-medium">
                    Scan full domain
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {scanFullDomain 
                      ? "Scan all pages within the domain" 
                      : "Scan only the specific URL"
                    }
                  </p>
                </div>
                <Switch
                  id="scan-mode"
                  checked={scanFullDomain}
                  onCheckedChange={setScanFullDomain}
                  disabled={isScanning}
                />
              </div>

              {/* Accessibility Standards Selection */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-medium">Accessibility Standards</Label>
                <div className="space-y-3">
                  {Object.entries(standardsDescriptions).map(([key, standard]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={key}
                          checked={accessibilityStandards[key as keyof typeof accessibilityStandards]}
                          onCheckedChange={(checked) => 
                            setAccessibilityStandards(prev => ({ ...prev, [key]: checked }))
                          }
                          disabled={isScanning}
                        />
                        <Label htmlFor={key} className="text-sm font-medium">
                          {standard.name}
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        {standard.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleScan} 
              className="w-full h-12 text-lg glow-effect"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  {scanFullDomain ? "Scanning domain..." : "Scanning page..."}
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5 mr-2" />
                  {scanFullDomain ? "Scan Full Domain" : "Scan Single Page"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">WCAG Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Full WCAG 2.1 AA compliance testing
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Get results in seconds, not minutes
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Detailed Reports</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive issue breakdown with fixes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
