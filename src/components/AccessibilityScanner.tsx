import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Globe, Scan, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AccessibilityIssue {
  type: 'error' | 'warning';
  code: string;
  message: string;
  selector: string;
  context: string;
}

interface ScanResult {
  url: string;
  timestamp: string;
  issues: AccessibilityIssue[];
  passed: number;
  failed: number;
  warnings: number;
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
    
    // Simulate pa11y scan (in real implementation, this would call your backend)
    setTimeout(() => {
      const mockResult: ScanResult = {
        url,
        timestamp: new Date().toISOString(),
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
          },
          {
            type: 'error',
            code: 'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Button.Name',
            message: 'Button element must have accessible name',
            selector: 'button.submit-btn',
            context: '<button class="submit-btn">Submit</button>'
          }
        ],
        passed: 47,
        failed: 2,
        warnings: 1
      };
      
      setScanResult(mockResult);
      setIsScanning(false);
      
      toast({
        title: "Scan Complete",
        description: `Found ${mockResult.failed} errors and ${mockResult.warnings} warnings`,
      });
    }, 2000);
  };

  const resetScan = () => {
    setScanResult(null);
    setUrl("");
  };

  if (scanResult) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Scan Complete</span>
            </div>
            <h1 className="text-4xl font-bold gradient-text">Accessibility Report</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive accessibility analysis for {scanResult.url}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{scanResult.passed}</div>
                <div className="text-sm text-muted-foreground">Tests Passed</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{scanResult.failed}</div>
                <div className="text-sm text-muted-foreground">Errors Found</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{scanResult.warnings}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </CardContent>
            </Card>
          </div>

          {/* Issues List */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Issues Found
              </CardTitle>
              <CardDescription>
                Detailed accessibility issues that need attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scanResult.issues.map((issue, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card/50">
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
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4">
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