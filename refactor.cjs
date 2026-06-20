const fs = require('fs');

async function refactorCustomer() {
  const file = 'src/components/CustomerDashboard.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Add supabase import
  if (!content.includes('import { supabase }')) {
    content = content.replace('import { \n  INDIAN_STATES', 'import { supabase } from "../lib/supabase";\nimport { \n  INDIAN_STATES');
  }

  // Add state & useEffect
  if (!content.includes('const [localRequests, setLocalRequests]')) {
    content = content.replace('const [activeTab, setActiveTab]', `const [localRequests, setLocalRequests] = useState<PickupRequest[]>([]);
  const [localNotifs, setLocalNotifs] = useState<Notification[]>([]);
  const [localProfiles, setLocalProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: reqs } = await supabase.from('pickup_requests').select('*').eq('customer_id', profile.id).order('created_at', { ascending: false });
      if (reqs) setLocalRequests(reqs);

      const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
      if (notifs) setLocalNotifs(notifs);

      const { data: profs } = await supabase.from('profiles').select('*');
      if (profs) setLocalProfiles(profs);
    };
    fetchData();
  }, [profile.id]);

  const [activeTab, setActiveTab]`);
  }

  // Update logic to use local variables
  content = content.replace(/const myRequests = requests\.filter/g, 'const myRequests = localRequests.filter');
  content = content.replace(/const myNotifs = notifications\.filter/g, 'const myNotifs = localNotifs.filter');
  content = content.replace(/const v = allProfiles\.find/g, 'const v = localProfiles.find');

  // Make handleCreateSubmit async
  content = content.replace('const handleCreateSubmit = (e: React.FormEvent) => {', 'const handleCreateSubmit = async (e: React.FormEvent) => {');

  // Insert to supabase inside handleCreateSubmit
  content = content.replace(
    /onCreateRequest\(\{\n\s*category_id/g,
    `const { data: newReq } = await supabase.from('pickup_requests').insert({
      customer_id: profile.id,
      category_id: formCategory,
      description: formDescription,
      address: formAddress,
      city: formCity,
      state: formStateVal,
      pincode: formPincode,
      image_urls: formImages,
      status: "pending"
    }).select();
    if (newReq) setLocalRequests([newReq[0], ...localRequests]);
    
    onCreateRequest({
      category_id`
  );

  // Update onCancelRequest
  content = content.replace(
    /onCancelRequest\(request\.id\);/g,
    `await supabase.from('pickup_requests').update({ status: 'cancelled' }).eq('id', request.id);
  setLocalRequests(localRequests.map(r => r.id === request.id ? { ...r, status: 'cancelled' } : r));
  onCancelRequest(request.id);`
  );

  content = content.replace(
    /onCancelRequest\(selectedRequest\.id\);/g,
    `await supabase.from('pickup_requests').update({ status: 'cancelled' }).eq('id', selectedRequest.id);
  setLocalRequests(localRequests.map(r => r.id === selectedRequest.id ? { ...r, status: 'cancelled' } : r));
  onCancelRequest(selectedRequest.id);`
  );

  fs.writeFileSync(file, content);
  console.log('CustomerDashboard updated');
}

async function refactorVendor() {
  const custFile = 'src/components/CustomerDashboard.tsx';
  let content = fs.readFileSync(custFile, 'utf8');

  // Vendor dashboard logic is basically CustomerDashboard for bulk requests.
  // We will modify the CustomerDashboard content and save it to VendorDashboard.tsx.
  
  content = content.replace(/CustomerDashboard/g, 'VendorDashboard');
  content = content.replace(/onSwitchToVendor/g, 'onSwitchToCustomer');
  content = content.replace(/vendor-dashboard/g, 'customer-dashboard');
  
  // Specific wording replacements to make it bulk
  content = content.replace(/Need scrap collected at your doorstep\?/g, 'Need a bulk pickup from your agency?');
  content = content.replace(/Welcome back, \{profile\.full_name\}\!/g, 'Vendor Area: {profile.full_name}');
  content = content.replace(/Ready to recycle household scrap today\?/g, 'Request bulk collection from our fleet today.');
  
  // Save to VendorDashboard.tsx
  fs.writeFileSync('src/components/VendorDashboard.tsx', content);
  console.log('VendorDashboard updated');
}

async function refactorAdmin() {
  const file = 'src/components/AdminDashboard.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add supabase import
  if (!content.includes('import { supabase }')) {
    content = content.replace('import { SubdomainsPage }', 'import { supabase } from "../lib/supabase";\nimport { SubdomainsPage }');
  }

  // 2. Add state & useEffect
  if (!content.includes('const [localProfiles, setLocalProfiles]')) {
    content = content.replace('const [activeTab, setActiveTab]', `const [localProfiles, setLocalProfiles] = useState<Profile[]>([]);
  const [localVendors, setLocalVendors] = useState<Vendor[]>([]);
  const [localRequests, setLocalRequests] = useState<PickupRequest[]>([]);
  const [localNotifs, setLocalNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: profs } = await supabase.from('profiles').select('*');
      if (profs) setLocalProfiles(profs);

      const { data: vends } = await supabase.from('vendors').select('*');
      if (vends) setLocalVendors(vends);

      const { data: reqs } = await supabase.from('pickup_requests').select('*').order('created_at', { ascending: false });
      if (reqs) setLocalRequests(reqs);

      const { data: notifs } = await supabase.from('notifications').select('*');
      if (notifs) setLocalNotifs(notifs);
    };
    fetchData();
  }, []);

  const [activeTab, setActiveTab]`);
  }

  // Replace usage
  content = content.replace(/const customerCount = profiles/g, 'const customerCount = localProfiles');
  content = content.replace(/const approvedVendorsCount = vendors/g, 'const approvedVendorsCount = localVendors');
  content = content.replace(/const pendingVendorsCount = vendors/g, 'const pendingVendorsCount = localVendors');
  content = content.replace(/const totalRequestsCount = requests/g, 'const totalRequestsCount = localRequests');
  content = content.replace(/const pendingRequestsCount = requests/g, 'const pendingRequestsCount = localRequests');
  content = content.replace(/const completedRequestsCount = requests/g, 'const completedRequestsCount = localRequests');
  content = content.replace(/profiles\.find/g, 'localProfiles.find');
  content = content.replace(/const approvedVendorsList = vendors/g, 'const approvedVendorsList = localVendors');
  content = content.replace(/const filteredRequests = requests/g, 'const filteredRequests = localRequests');
  content = content.replace(/const filteredVendors = vendors/g, 'const filteredVendors = localVendors');
  content = content.replace(/const filteredCustomers = profiles/g, 'const filteredCustomers = localProfiles');
  content = content.replace(/\{vendors\n\s*\.filter/g, '{localVendors\n                      .filter');
  content = content.replace(/\{requests\n\s*\.filter/g, '{localRequests\n                      .filter');
  content = content.replace(/requests\.filter/g, 'localRequests.filter');

  // Modify Vendor Assignment logic - Admin just changes status to "in_progress" or "completed"
  // Look for the select element assigning vendor and change it to a generic status dropdown.
  // Wait, I can just replace the logic of onAssignVendor to update supabase directly.
  
  // Replace the onAssignVendor logic in the select element
  content = content.replace(
    /onChange=\{\(e\) => onAssignVendor\(req\.id, e\.target\.value\)\}/g,
    `onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  if (!newStatus) return;
                                  await supabase.from('pickup_requests').update({ status: newStatus }).eq('id', req.id);
                                  setLocalRequests(localRequests.map(r => r.id === req.id ? { ...r, status: newStatus as PickupRequestStatus } : r));
                                }}`
  );
  
  // Also change the select dropdown options to statuses instead of vendors
  content = content.replace(
    /value=\{req\.vendor_id \|\| ""\}/g,
    `value={req.status}`
  );
  content = content.replace(
    /<option value="">-- Choose Vendor --<\/option>\s*\{approvedVendorsList\.map\(v => \(\s*<option key=\{v\.vendor_id\} value=\{v\.user_id\}>\s*\{v\.displayName\}\s*<\/option>\s*\)\)\}/g,
    `<option value="pending">Pending</option>
                                <option value="in_progress">Dispatched (In Progress)</option>
                                <option value="completed">Completed</option>`
  );

  fs.writeFileSync(file, content);
  console.log('AdminDashboard updated');
}

async function main() {
  await refactorCustomer();
  await refactorVendor();
  await refactorAdmin();
}

main();
