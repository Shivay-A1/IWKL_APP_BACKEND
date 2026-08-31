import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../admin/data/models/admin_fan_club_model.dart';

class FanClubService {
  static const String _fanClubMembersKey = 'fan_club_members';
  
  static Future<List<AdminFanClubModel>> getAllMembers() async {
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
