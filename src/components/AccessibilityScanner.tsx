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

export const AccessibilityScanner = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanFullDomain, setScanFullDomain] = useState(false);
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
        const mockPages: PageResult[] = [
          {
            url: `${url}`,
            title: "Home Page",
            issues: [
              {
                type: 'error',
                code: 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37',
                message: 'Img element missing an alt attribute',
                selector: 'img[src="hero-image.jpg"]',
                context: '<img src="hero-image.jpg" class="hero-img">'
              }
            ],
            passed: 45,
            failed: 1,
            warnings: 0,
            loadTime: 1.2,
            statusCode: 200
          },
          {
            url: `${url}/about`,
            title: "About Us",
            issues: [
              {
                type: 'warning',
                code: 'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
                message: 'Document should have a title element',
                selector: 'html',
                context: '<html><head>...'
              }
            ],
            passed: 32,
            failed: 0,
            warnings: 1,
            loadTime: 0.8,
            statusCode: 200
          },
          {
            url: `${url}/products`,
            title: "Products",
            issues: [
              {
                type: 'error',
                code: 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H43.IncorrectAttr',
                message: 'Table headers missing scope attribute',
                selector: 'table th',
                context: '<th>Product Name</th>'
              }
            ],
            passed: 28,
            failed: 1,
            warnings: 0,
            loadTime: 1.5,
            statusCode: 200
          },
          {
            url: `${url}/contact`,
            title: "Contact Us",
            issues: [
              {
                type: 'error',
                code: 'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Button.Name',
                message: 'Button element must have accessible name',
                selector: 'button.submit-btn',
                context: '<button class="submit-btn">Submit</button>'
              },
              {
                type: 'warning',
                code: 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail',
                message: 'Insufficient color contrast',
                selector: '.text-gray-400',
                context: '<span class="text-gray-400">Secondary text</span>'
              }
            ],
            passed: 25,
            failed: 1,
            warnings: 1,
            loadTime: 0.9,
            statusCode: 200
          },
          {
            url: `${url}/blog`,
            title: "Blog",
            issues: [],
            passed: 38,
            failed: 0,
            warnings: 0,
            loadTime: 1.1,
            statusCode: 200
          }
        ];

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
          scanDuration: 4.2,
          complianceScore
        };
        
        setScanResult(mockResult);
        setIsScanning(false);
        
        toast({
          title: "Domain Scan Complete",
          description: `Scanned ${mockResult.totalPages} pages. Found ${mockResult.totalFailed} errors and ${mockResult.totalWarnings} warnings`,
        });
      }, 4000);
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
          <div className="grid md:grid-cols-4 gap-6 mb-8">
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
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{scanResult.complianceScore}%</div>
                  <Progress value={scanResult.complianceScore} className="h-2" />
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
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-400">{scanResult.totalPassed}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round((scanResult.totalPassed / (scanResult.totalPassed + scanResult.totalFailed)) * 100)}% success rate
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
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-red-400">{scanResult.totalFailed}</div>
                  <div className="text-sm text-muted-foreground">
                    Across {scanResult.pagesScanned.filter(p => p.failed > 0).length} page{scanResult.pagesScanned.filter(p => p.failed > 0).length !== 1 ? 's' : ''}
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
                    Recommendations for improvement
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
                          <Badge variant={pageScore >= 90 ? "default" : pageScore >= 70 ? "secondary" : "destructive"}>
                            {pageScore}%
                          </Badge>
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
                                View context
                              </summary>
                              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                                {issue.context}
                              </pre>
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powered by Vudu Magic</span>
          </div>
          
          <h1 className="text-6xl font-bold gradient-text animate-slide-up">
            Vudu A11y
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-lg mx-auto animate-slide-up">
            Unleash the power of accessibility testing. 
            Enter a URL and get detailed WCAG compliance reports with mystical precision.
          </p>
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
