import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileSpreadsheet, Upload, Check, AlertCircle, Download } from 'lucide-react';

const AdminCsvImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file',
          description: 'Please select a CSV file',
          variant: 'destructive'
        });
        return;
      }

      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        
        const data = [];
        for (let i = 1; i < Math.min(rows.length, 6); i++) {
          if (rows[i].trim()) {
            const values = rows[i].split(',').map(v => v.trim());
            const row: Record<string, string> = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            
            data.push(row);
          }
        }
        
        setHeaders(headers);
        setPreviewData(data);
        setImportErrors([]);
      } catch (error) {
        console.error('Error parsing CSV', error);
        toast({
          title: 'Error',
          description: 'Failed to parse CSV file',
          variant: 'destructive'
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setImportErrors([]);
    setImportSuccess(false);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would process the CSV and save to Supabase
      
      setImportSuccess(true);
      toast({
        title: 'Success',
        description: 'Requirements imported successfully',
      });
      
      // Clear the file and preview data after successful import
      setTimeout(() => {
        setFile(null);
        setPreviewData([]);
        setHeaders([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    } catch (error) {
      console.error('Error importing CSV', error);
      setImportErrors(['Failed to import data. Please check your file format.']);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create a sample template CSV
    const headers = 'title,description,category,is_required,min_value,max_value';
    const rows = [
      'Minimum Roof Size,Property must have minimum roof size,property,true,600,',
      'Internet Speed,Property must have high-speed internet,technical,true,100,',
      'Property Insurance,Property must have insurance,insurance,true,,'
    ];
    const csvContent = [headers, ...rows].join('\n');
    
    // Create a download link and trigger it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'requirements_template.csv';
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Requirements</CardTitle>
        <CardDescription>
          Import qualification requirements from a CSV file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <div className="text-sm text-muted-foreground">
            Upload a CSV file with requirements data
          </div>
        </div>
        
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium">Click to select a CSV file</p>
              <p className="text-sm text-muted-foreground">
                or drag and drop your file here
              </p>
            </div>
          </label>
        </div>

        {file && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-semibold">Selected file:</span>{' '}
                {file.name}
              </div>
              <Button
                onClick={() => {
                  setFile(null);
                  setPreviewData([]);
                  setHeaders([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                variant="ghost"
                size="sm"
              >
                Clear
              </Button>
            </div>

            {previewData.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Preview (first 5 rows):</h3>
                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {headers.map((header, cellIndex) => (
                            <TableCell key={cellIndex}>{row[header]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {importErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Import failed</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {importErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {importSuccess && (
              <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertTitle>Import successful</AlertTitle>
                <AlertDescription>
                  All requirements have been imported successfully.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleImport} 
              disabled={isUploading || previewData.length === 0}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Requirements
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCsvImport;
