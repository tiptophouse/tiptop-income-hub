
interface SpeedTestResult {
  download: number;
  upload: number;
  latency: number;
}

export const measureInternetSpeed = async (): Promise<SpeedTestResult> => {
  // Simulate speed test for now
  // In a real implementation, you would use a proper speed test service
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        download: Math.floor(80 + Math.random() * 40), // 80-120 Mbps
        upload: Math.floor(20 + Math.random() * 20),   // 20-40 Mbps
        latency: Math.floor(10 + Math.random() * 30),  // 10-40ms
      });
    }, 2000);
  });
};
