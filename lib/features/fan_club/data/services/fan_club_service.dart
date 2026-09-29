import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../../admin/data/models/admin_fan_club_model.dart';
import '../../../../core/constants/app_constants.dart';

class FanClubService {
  static const String _fanClubMembersKey = 'fan_club_members';
  static const String _baseUrl = AppConstants.baseUrl;
  
  static Future<List<AdminFanClubModel>> getAllMembers() async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/fan-club'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['data'] != null) {
          return (data['data'] as List)
              .map((json) => AdminFanClubModel.fromJson(json))
              .toList();
        }
      }
    } catch (e) {
      print('Error fetching from backend: $e');
    }
    
    // Fallback to local storage
    final prefs = await SharedPreferences.getInstance();
    final membersJson = prefs.getString(_fanClubMembersKey);
    
    if (membersJson == null) {
      return [];
    }
    
    try {
      final List<dynamic> decoded = json.decode(membersJson);
      return decoded.map((json) => AdminFanClubModel.fromJson(json)).toList();
    } catch (e) {
      return [];
    }
  }
  
  static Future<bool> addMember(AdminFanClubModel member) async {
    try {
      // Map Flutter model fields to backend field names
      final backendData = {
        'fullName': member.fullName,
        'mobileNumber': member.mobile, // Map mobile to mobileNumber
        'email': member.email,
        'state': member.state,
        'city': member.city,
        'favoriteTeamId': member.supportedTeamId,
        'supportedTeam': member.supportedTeam,
        'gender': 'Other', // Default value since Flutter form doesn't have gender
        'age': 18, // Default value since Flutter form doesn't have age
      };
      
      // Try to send to backend first
      final response = await http.post(
        Uri.parse('$_baseUrl/fan-club'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(backendData),
      );
      
      if (response.statusCode == 201 || response.statusCode == 200) {
        return true;
      }
    } catch (e) {
      print('Error sending to backend: $e');
    }
    
    // Fallback to local storage
    final prefs = await SharedPreferences.getInstance();
    final members = await getAllMembers();
    
    // Check for duplicate mobile number
    if (members.any((m) => m.mobile == member.mobile)) {
      return false;
    }
    
    members.add(member);
    final membersJson = json.encode(members.map((m) => m.toJson()).toList());
    return await prefs.setString(_fanClubMembersKey, membersJson);
  }
  
  static Future<bool> deleteMember(String memberId) async {
    try {
      final response = await http.delete(Uri.parse('$_baseUrl/fan-club/$memberId'));
      if (response.statusCode == 200 || response.statusCode == 204) {
        return true;
      }
    } catch (e) {
      print('Error deleting from backend: $e');
    }
    
    // Fallback to local storage
    final prefs = await SharedPreferences.getInstance();
    final members = await getAllMembers();
    
    members.removeWhere((m) => m.id == memberId);
    final membersJson = json.encode(members.map((m) => m.toJson()).toList());
    return await prefs.setString(_fanClubMembersKey, membersJson);
  }
  
  static Future<List<AdminFanClubModel>> filterByTeam(String teamName) async {
    final members = await getAllMembers();
    return members.where((m) => m.supportedTeam == teamName).toList();
  }
  
  static Future<List<AdminFanClubModel>> filterByState(String state) async {
    final members = await getAllMembers();
    return members.where((m) => m.state == state).toList();
  }
  
  static Future<List<AdminFanClubModel>> searchMembers(String query) async {
    final members = await getAllMembers();
    final lowerQuery = query.toLowerCase();
    
    return members.where((m) =>
      m.fullName.toLowerCase().contains(lowerQuery) ||
      m.mobile.contains(lowerQuery) ||
      m.city.toLowerCase().contains(lowerQuery) ||
      m.supportedTeam.toLowerCase().contains(lowerQuery)
    ).toList();
  }
  
  static Future<Map<String, int>> getStatistics() async {
    final members = await getAllMembers();
    
    final Map<String, int> teamStats = {};
    final Map<String, int> stateStats = {};
    
    for (final member in members) {
      teamStats[member.supportedTeam] = (teamStats[member.supportedTeam] ?? 0) + 1;
      stateStats[member.state] = (stateStats[member.state] ?? 0) + 1;
    }
    
    return {
      'totalMembers': members.length,
      ...teamStats,
      ...stateStats.map((key, value) => MapEntry('state_$key', value)),
    };
  }
}
